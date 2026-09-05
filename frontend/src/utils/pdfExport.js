import { jsPDF } from 'jspdf';

/**
 * Generates and downloads a professional, multi-page Song Sheet PDF with all required sections.
 */
export function generateSongPDF({
  song,
  analysis,
  moodBoard,
  mood,
  genre,
  theme,
  versionNumber = 1,
  exportDate = new Date().toISOString(),
  dateGenerated = new Date().toISOString()
}) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = 210;
  const pageHeight = 297;
  const marginLeft = 18;
  const marginRight = 18;
  const contentWidth = pageWidth - marginLeft - marginRight;
  let y = 22;

  // Helper to ensure page overflow management
  const checkNewPage = (neededSpace = 12) => {
    if (y + neededSpace > pageHeight - 22) {
      doc.addPage();
      y = 22;
    }
  };

  const addDivider = (spacingBefore = 4, spacingAfter = 5) => {
    checkNewPage(spacingBefore + spacingAfter + 2);
    y += spacingBefore;
    doc.setDrawColor(220, 226, 235);
    doc.setLineWidth(0.3);
    doc.line(marginLeft, y, marginLeft + contentWidth, y);
    y += spacingAfter;
  };

  const addSectionHeader = (title) => {
    checkNewPage(16);
    y += 4;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    doc.setTextColor(30, 41, 59); // Slate-800
    doc.text(title, marginLeft, y);
    y += 2;
    doc.setDrawColor(99, 102, 241); // Indigo-500 accent line
    doc.setLineWidth(0.8);
    doc.line(marginLeft, y, marginLeft + 35, y);
    y += 6;
  };

  // Format Dates
  let formattedExportDate = '';
  try {
    const d = new Date(exportDate || Date.now());
    formattedExportDate = d.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch {
    formattedExportDate = String(exportDate || new Date().toLocaleString());
  }

  // Energy calculation based on mood and tempo
  let energyLevel = 'Dynamic / Moderate Energy';
  const tempoNum = parseInt(moodBoard?.bpm || '90', 10);
  if (tempoNum > 120 || ['Energetic', 'Happy', 'Angry', 'Dance', 'Rock'].includes(mood)) {
    energyLevel = 'High Energy / Driving';
  } else if (tempoNum < 80 || ['Melancholic', 'Sad', 'Peaceful', 'Lo-fi', 'Dreamy'].includes(mood)) {
    energyLevel = 'Intimate / Low-Key Energy';
  } else {
    energyLevel = 'Balanced / Mid-Tempo Energy';
  }

  // 1. TITLE & BRAND HEADER
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(99, 102, 241);
  doc.text(`LYRICRAFT LEAD SHEET  •  VERSION ${versionNumber || 1}`, marginLeft, y);
  y += 7;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.setTextColor(15, 23, 42); // Slate-900
  const titleText = `${song.title || 'Untitled Song'} (Version ${versionNumber || 1})`;
  const titleLines = doc.splitTextToSize(titleText, contentWidth);
  doc.text(titleLines, marginLeft, y);
  y += (titleLines.length * 8) + 1;

  // 2. METADATA SUMMARY BAR (Genre, Mood, Version, Export Date)
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(71, 85, 105); // Slate-600

  // Row 1: Genre, Mood, Version
  doc.setFont('helvetica', 'bold');
  doc.text('Genre: ', marginLeft, y);
  doc.setFont('helvetica', 'normal');
  doc.text(genre || 'Dynamic Genre', marginLeft + 14, y);

  doc.setFont('helvetica', 'bold');
  doc.text('Mood: ', marginLeft + 58, y);
  doc.setFont('helvetica', 'normal');
  doc.text(mood || 'Dynamic Mood', marginLeft + 72, y);

  doc.setFont('helvetica', 'bold');
  doc.text('Version: ', marginLeft + 120, y);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(99, 102, 241);
  doc.text(`Version ${versionNumber || 1}`, marginLeft + 137, y);
  y += 6;

  // Row 2: Export Date
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(71, 85, 105);
  doc.text('Export Date: ', marginLeft, y);
  doc.setFont('helvetica', 'normal');
  doc.text(formattedExportDate, marginLeft + 23, y);
  y += 6;

  // Row 3: Theme
  const themeVal = theme || song.concept || 'Original Theme';
  doc.setFont('helvetica', 'bold');
  doc.text('Theme: ', marginLeft, y);
  doc.setFont('helvetica', 'italic');
  const themeLines = doc.splitTextToSize(`"${themeVal}"`, contentWidth - 16);
  doc.text(themeLines, marginLeft + 15, y);
  y += (themeLines.length * 5) + 2;

  addDivider(2, 4);

  // 3. SONG CONCEPT
  const conceptVal = song.concept || themeVal;
  addSectionHeader('Song Concept');
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(51, 65, 85);
  const conceptLines = doc.splitTextToSize(conceptVal, contentWidth);
  doc.text(conceptLines, marginLeft, y);
  y += (conceptLines.length * 5) + 4;

  // 4. SONG STRUCTURE
  if (song.sections && song.sections.length > 0) {
    addSectionHeader('Song Structure');
    const structureList = song.sections.map((s) => s.type.toUpperCase()).join('  →  ');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(79, 70, 229);
    const structLines = doc.splitTextToSize(structureList, contentWidth);
    doc.text(structLines, marginLeft, y);
    y += (structLines.length * 5) + 4;
  }

  // 5. LYRICS (Full formatted song lyrics with sections)
  addSectionHeader('Lyrics');
  if (song.sections) {
    song.sections.forEach((sec, sIdx) => {
      checkNewPage(14);
      
      // Section Tag
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10.5);
      doc.setTextColor(30, 58, 138); // Deep indigo
      doc.text(`[${sec.type.toUpperCase()}]`, marginLeft, y);
      y += 6;

      // Section Lines
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.setTextColor(31, 41, 55);

      sec.lines.forEach((line) => {
        checkNewPage(6);
        const lLines = doc.splitTextToSize(line, contentWidth - 5);
        doc.text(lLines, marginLeft + 4, y);
        y += (lLines.length * 5.2);
      });

      y += 4; // space between sections
    });
  }

  addDivider(4, 4);

  // 6. OVERALL RHYME STYLE & SONGWRITING NOTES
  if (song.overall_rhyme_style || song.songwriting_notes) {
    addSectionHeader('Songwriting & Performance Notes');

    if (song.overall_rhyme_style) {
      checkNewPage(8);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9.5);
      doc.setTextColor(30, 41, 59);
      doc.text('Overall Rhyme Style: ', marginLeft, y);
      doc.setFont('helvetica', 'normal');
      doc.text(song.overall_rhyme_style, marginLeft + 42, y);
      y += 6;
    }

    if (song.songwriting_notes) {
      checkNewPage(12);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9.5);
      doc.setTextColor(30, 41, 59);
      doc.text('Songwriting Notes: ', marginLeft, y);
      y += 5;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(71, 85, 105);
      const noteLines = doc.splitTextToSize(song.songwriting_notes, contentWidth);
      doc.text(noteLines, marginLeft, y);
      y += (noteLines.length * 4.8) + 4;
    }

    addDivider(2, 4);
  }

  // 7. RHYME SCHEME ANALYSIS & SYLLABLE COUNT ANALYSIS
  addSectionHeader('Rhyme Scheme & Syllable Analysis');
  
  checkNewPage(18);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(30, 41, 59);

  doc.text('Overall Rhyme Scheme: ', marginLeft, y);
  doc.setFont('helvetica', 'normal');
  doc.text(analysis?.rhyme_scheme || 'Dynamic Flow', marginLeft + 44, y);
  y += 5.5;

  doc.text('Total Syllables: ', marginLeft, y);
  doc.setFont('helvetica', 'normal');
  doc.text(`${analysis?.total_syllables || 'N/A'} syllables`, marginLeft + 32, y);

  doc.setFont('helvetica', 'bold');
  doc.text('Avg Syllables / Line: ', marginLeft + 85, y);
  doc.setFont('helvetica', 'normal');
  doc.text(`${analysis?.avg_syllables_per_line || 'N/A'}`, marginLeft + 125, y);
  y += 7;

  // Breakdown Table for each Section
  if (analysis?.sections && analysis.sections.length > 0) {
    checkNewPage(14);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(71, 85, 105);
    doc.text('Section Breakdown:', marginLeft, y);
    y += 4.5;

    analysis.sections.forEach((secAnalysis) => {
      checkNewPage(6);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(51, 65, 85);
      doc.text(`• ${secAnalysis.type}:`, marginLeft + 4, y);
      
      doc.setFont('helvetica', 'normal');
      const schemeText = `Scheme: ${secAnalysis.rhyme_scheme || 'Freeverse'} | Avg: ${secAnalysis.avg_syllables || 'N/A'} syl/line`;
      doc.text(schemeText, marginLeft + 35, y);
      y += 4.5;
    });
    y += 3;
  }

  addDivider(2, 4);

  // 8. MOOD BOARD (Suggested Instruments, Tempo, Energy, Musical Style)
  addSectionHeader('Musical Mood Board');
  
  checkNewPage(24);
  const instruments = moodBoard?.instruments?.join(', ') || 'Acoustic instruments, Piano, Rhythm section';
  const vibes = moodBoard?.vibes?.join(', ') || 'Atmospheric, Evocative';
  const bpm = moodBoard?.bpm || '80–100 BPM';

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(30, 41, 59);

  // Tempo
  doc.text('Tempo: ', marginLeft, y);
  doc.setFont('helvetica', 'normal');
  doc.text(bpm, marginLeft + 20, y);
  y += 5.5;

  // Energy
  doc.setFont('helvetica', 'bold');
  doc.text('Energy: ', marginLeft, y);
  doc.setFont('helvetica', 'normal');
  doc.text(energyLevel, marginLeft + 20, y);
  y += 5.5;

  // Musical Style
  doc.setFont('helvetica', 'bold');
  doc.text('Musical Style: ', marginLeft, y);
  doc.setFont('helvetica', 'normal');
  doc.text(`${genre} • ${mood} (${vibes})`, marginLeft + 30, y);
  y += 5.5;

  // Suggested Instruments
  doc.setFont('helvetica', 'bold');
  doc.text('Suggested Instruments: ', marginLeft, y);
  doc.setFont('helvetica', 'normal');
  const instLines = doc.splitTextToSize(instruments, contentWidth - 45);
  doc.text(instLines, marginLeft + 45, y);
  y += (instLines.length * 5) + 6;

  // 9. FOOTER ON EVERY PAGE (Generated by LyriCraft • Page X of Y)
  const totalPages = doc.internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    
    // Bottom separator line
    doc.setDrawColor(203, 213, 225); // Slate-300
    doc.setLineWidth(0.3);
    doc.line(marginLeft, pageHeight - 14, marginLeft + contentWidth, pageHeight - 14);

    // Left Footer
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(99, 102, 241);
    doc.text('Generated by LyriCraft', marginLeft, pageHeight - 9);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(148, 163, 184); // Slate-400
    doc.text('• AI Songwriting Studio', marginLeft + 40, pageHeight - 9);

    // Right Page Number
    const pageStr = `Page ${i} of ${totalPages}`;
    const pageStrWidth = doc.getTextWidth(pageStr);
    doc.text(pageStr, marginLeft + contentWidth - pageStrWidth, pageHeight - 9);
  }

  // Save the PDF
  const sanitizedTitle = (song.title || 'lyricraft_song')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '_')
    .slice(0, 40);
  doc.save(`${sanitizedTitle}_leadsheet.pdf`);
}
