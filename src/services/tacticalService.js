import { supabase } from "../supabaseClient";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable"; // Updated import

export const tacticalService = {
  // Utility to get current user ID safely
  async getUserId() {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    return user?.id;
  },

  // --- STUDY SESSIONS ---
  async saveSession(session) {
    const userId = await this.getUserId();
    if (!userId) return;
    return await supabase
      .from("study_sessions")
      .upsert({ ...session, user_id: userId }, { onConflict: "id" });
  },

  // --- HABITS & TRACKER ---
  async syncDailyHabit(habitData) {
    const userId = await this.getUserId();
    const date = new Date().toISOString().split("T")[0];
    if (!userId) return;

    return await supabase.from("daily_logs").upsert(
      {
        id: `${userId}-${date}`,
        date,
        user_id: userId,
        ...habitData,
      },
      { onConflict: "id" }
    );
  },

  // --- SYLLABUS PROGRESS ---
  async updateSyllabus(topicName, isCompleted) {
    const userId = await this.getUserId();
    if (!userId) return;

    return await supabase.from("syllabus_progress").upsert(
      {
        id: `${userId}-${topicName}`,
        topic_name: topicName,
        is_completed: isCompleted,
        user_id: userId,
      },
      { onConflict: "id" }
    );
  },

  // --- STRATEGIC PDF EXPORT ENGINE ---
  exportToPDF(data, title) {
    if (!data || !Array.isArray(data) || data.length === 0) {
      console.error("Tactical Error: No data provided for PDF generation.");
      return;
    }
    // Initialize the document
    const doc = new jsPDF();
    const timestamp = new Date().toLocaleString();

    // 1. Set Tactical Header
    doc.setFontSize(18);
    doc.setTextColor(15, 23, 42); // slate-900
    doc.text("WARRIOR MODE: OPS REPORT", 14, 20);

    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Subject: ${title}`, 14, 30);
    doc.text(`Generated: ${timestamp}`, 14, 35);

    // 2. Format Data for Table
    // Filtering out technical metadata for the report
    const headers = Object.keys(data[0]).filter(
      (key) => !["id", "user_id", "created_at", "updated_at"].includes(key)
    );
    const rows = data.map((item) =>
      headers.map((header) => item[header]?.toString() || "N/A")
    );

    // 3. Generate AutoTable using the imported function directly
    // This fixes the "doc.autoTable is not a function" error
    autoTable(doc, {
      startY: 45,
      head: [headers.map((h) => h.replace(/_/g, " ").toUpperCase())],
      body: rows,
      theme: "grid",
      headStyles: {
        fillColor: [30, 41, 59],
        textColor: [255, 255, 255],
        fontStyle: "bold",
        halign: "center",
      },
      alternateRowStyles: { fillColor: [241, 245, 249] },
      styles: {
        fontSize: 8,
        cellPadding: 3,
        overflow: "linebreak",
      },
      margin: { top: 45 },
    });

    // 4. Save the Document
    const fileName = `${title.replace(/\s+/g, "_")}_${
      new Date().toISOString().split("T")[0]
    }.pdf`;
    doc.save(fileName);
  },
};
