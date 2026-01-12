import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../supabaseClient';
import { showToast } from '../services/notificationService';

export const useSyllabus = () => {
  const [completedTopics, setCompletedTopics] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadSyllabus = useCallback(async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from('syllabus_progress')
      .select('topic_name')
      .eq('user_id', user.id);

    if (error) {
      showToast("Sync Error: " + error.message, "error");
    } else {
      setCompletedTopics(data.map(item => item.topic_name));
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    loadSyllabus();
  }, [loadSyllabus]);

  const toggleTopic = async (topicName) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const isCurrentlyCompleted = completedTopics.includes(topicName);
    const compositeId = `${user.id}-${topicName}`;

    // Optimistic Update for "Warrior" speed
    setCompletedTopics(prev => 
      isCurrentlyCompleted ? prev.filter(t => t !== topicName) : [...prev, topicName]
    );

    if (isCurrentlyCompleted) {
      // Remove from cloud
      const { error } = await supabase
        .from('syllabus_progress')
        .delete()
        .eq('id', compositeId);
      
      if (error) {
        showToast("Cloud sync failed", "error");
        loadSyllabus(); // Revert
      }
    } else {
      // Add to cloud
      const { error } = await supabase
        .from('syllabus_progress')
        .insert({
          id: compositeId,
          user_id: user.id,
          topic_name: topicName
        });

      if (error) {
        showToast("Cloud sync failed", "error");
        loadSyllabus(); // Revert
      } else {
        showToast(`Mastered: ${topicName.split(':')[0]}`);
      }
    }
  };

  return { completedTopics, toggleTopic, loading };
};