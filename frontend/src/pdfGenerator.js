import { jsPDF } from 'jspdf';

export function generateInvoicePDF(order, settings = {}) {
  // Create jsPDF instance (A4 size: 210mm x 297mm)
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth(); // 210
  const pageHeight = doc.internal.pageSize.getHeight(); // 297

  const shopName = settings.shop_name || "SRI KEDARESWARA ENTERPRISES";
  const shopAddress = settings.shop_address || "DOOR NO: 13-12-5, RAMA SCOIETY STREET, KOVVUR";
  const proprietorInfo = settings.proprietor_info || "PROP: N. Rajyalakshmi      PH NO: 7997696636";
  const bankName = settings.bank_name || "SBI, KOVVURU";
  const bankAccount = settings.bank_account || "AC.NO: 36444436717";
  const bankIfsc = settings.bank_ifsc || "IFSC CODE: SBIN0000860";
  const leftLogo = settings.left_logo || "";
  const rightLogo = settings.right_logo || "";

  // Add decorative background/border
  doc.setDrawColor(220, 225, 235);
  doc.setLineWidth(0.3);
  doc.rect(5, 5, pageWidth - 10, pageHeight - 10);

  // --- HEADER SECTION ---
  // Left image frame
  if (leftLogo) {
    try {
      doc.addImage(leftLogo, 'JPEG', 12, 10, 20, 20);
    } catch (e) {
      console.error("Error rendering left logo:", e);
      // Fallback
      doc.setDrawColor(240, 200, 200);
      doc.rect(12, 10, 20, 20);
      doc.setFontSize(6);
      doc.setTextColor(150, 150, 150);
      doc.text("LAKSHMI", 16, 21);
      doc.text("IMAGE", 18, 24);
    }
  } else {
    doc.setDrawColor(240, 200, 200);
    doc.rect(12, 10, 20, 20);
    doc.setFontSize(6);
    doc.setTextColor(150, 150, 150);
    doc.text("LAKSHMI", 16, 21);
    doc.text("IMAGE", 18, 24);
  }

  // Right image frame
  if (rightLogo) {
    try {
      doc.addImage(rightLogo, 'JPEG', pageWidth - 32, 10, 20, 20);
    } catch (e) {
      console.error("Error rendering right logo:", e);
      // Fallback
      doc.setDrawColor(240, 200, 200);
      doc.rect(pageWidth - 32, 10, 20, 20);
      doc.setFontSize(6);
      doc.setTextColor(150, 150, 150);
      doc.text("GANESHA", pageWidth - 29, 21);
      doc.text("IMAGE", pageWidth - 27, 24);
    }
  } else {
    doc.setDrawColor(240, 200, 200);
    doc.rect(pageWidth - 32, 10, 20, 20);
    doc.setFontSize(6);
    doc.setTextColor(150, 150, 150);
    doc.text("GANESHA", pageWidth - 29, 21);
    doc.text("IMAGE", pageWidth - 27, 24);
  }

  // Shop Header Details (Red Color like the physical copy)
  doc.setTextColor(210, 20, 20); // Bright red
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text(shopName, pageWidth / 2, 16, { align: 'center' });
  
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.text(shopAddress, pageWidth / 2, 21, { align: 'center' });
  
  doc.setFont("helvetica", "bold");
  doc.text(proprietorInfo, pageWidth / 2, 26, { align: 'center' });

  // --- CUSTOMER DETAILS BOX ---
  const boxX = 10;
  const boxY = 33;
  const boxW = pageWidth - 20; // 190
  const boxH = 16;
  
  doc.setDrawColor(0);
  doc.setLineWidth(0.4);
  doc.rect(boxX, boxY, boxW, boxH);
  
  // Dividers
  doc.line(boxX, boxY + 8, boxX + boxW, boxY + 8); // Horizontal middle divider
  doc.line(boxX + 130, boxY, boxX + 130, boxY + boxH); // Vertical date divider
  
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(0);
  
  // Left Column Labels & Values
  doc.text("NAME:", boxX + 3, boxY + 5.5);
  doc.setFont("helvetica", "normal");
  doc.text(order.customer_name || 'Avanti Feeds Limited', boxX + 18, boxY + 5.5);
  
  doc.setFont("helvetica", "bold");
  doc.text("ADRESS:", boxX + 3, boxY + 13);
  doc.setFont("helvetica", "normal");
  doc.text(order.customer_address || 'Kovvuru', boxX + 18, boxY + 13);
  
  // Right Column Labels & Values
  doc.setFont("helvetica", "bold");
  doc.text("DATE:", boxX + 133, boxY + 5.5);
  doc.setFont("helvetica", "normal");
  const orderDate = order.created_at ? new Date(order.created_at).toLocaleDateString('en-GB') : new Date().toLocaleDateString('en-GB');
  doc.text(orderDate, boxX + 148, boxY + 5.5);
  
  doc.setFont("helvetica", "bold");
  doc.text("INV NO:", boxX + 133, boxY + 13);
  doc.setFont("helvetica", "normal");
  doc.text(order.enquiry_id || 'SKE-2026-0101', boxX + 148, boxY + 13);

  // --- ITEMS TABLE SECTION ---
  const tableY = 53;
  const colX = {
    sno: 10,
    desc: 25,
    qty: 135,
    price: 155,
    amount: 175
  };
  const colW = {
    sno: 15,
    desc: 110,
    qty: 20,
    price: 20,
    amount: 25
  };
  const rowH = 5.2; // Row height matches standard receipts
  const maxRows = 31; // Exact grid count from physical pad

  // Header row
  doc.setLineWidth(0.4);
  doc.rect(boxX, tableY, boxW, rowH);
  
  // Vertical column lines for header
  doc.line(colX.desc, tableY, colX.desc, tableY + rowH);
  doc.line(colX.qty, tableY, colX.qty, tableY + rowH);
  doc.line(colX.price, tableY, colX.price, tableY + rowH);
  doc.line(colX.amount, tableY, colX.amount, tableY + rowH);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.text("S.NO", colX.sno + colW.sno / 2, tableY + 3.8, { align: 'center' });
  doc.text("ITEM DISCRIPTION", colX.desc + 3, tableY + 3.8);
  doc.text("QTY", colX.qty + colW.qty / 2, tableY + 3.8, { align: 'center' });
  doc.text("PRICE", colX.price + colW.price / 2, tableY + 3.8, { align: 'center' });
  doc.text("AMOUNT", colX.amount + colW.amount / 2, tableY + 3.8, { align: 'center' });

  // Grid outline for items list
  const gridStartY = tableY + rowH;
  const gridHeight = rowH * maxRows; // 31 * 5.2 = 161.2mm
  
  doc.rect(boxX, gridStartY, boxW, gridHeight);
  
  // Draw vertical lines inside grid
  doc.line(colX.desc, gridStartY, colX.desc, gridStartY + gridHeight);
  doc.line(colX.qty, gridStartY, colX.qty, gridStartY + gridHeight);
  doc.line(colX.price, gridStartY, colX.price, gridStartY + gridHeight);
  doc.line(colX.amount, gridStartY, colX.amount, gridStartY + gridHeight);

  // Filter out items that are marked as out-of-stock
  const activeItems = (order.items || []).filter(item => item.available_in_stock !== false);

  // Fill in active items & empty lines
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  
  for (let i = 0; i < maxRows; i++) {
    const currentY = gridStartY + (i * rowH);
    
    // Draw horizontal row divider line
    if (i < maxRows - 1) {
      doc.setDrawColor(200, 200, 200); // Light gray horizontal lines
      doc.setLineWidth(0.1);
      doc.line(boxX, currentY + rowH, boxX + boxW, currentY + rowH);
    }
    
    // Write item text if exists
    if (i < activeItems.length) {
      const item = activeItems[i];
      doc.setTextColor(0);
      
      // S.NO
      doc.text((i + 1).toString(), colX.sno + colW.sno / 2, currentY + 3.8, { align: 'center' });
      
      // DESCRIPTION (Shortened if too long)
      const fullName = `${item.item_name} ${item.size !== 'N/A' ? item.size : ''}`.trim();
      const cleanDesc = fullName.substring(0, 55);
      doc.text(cleanDesc, colX.desc + 3, currentY + 3.8);
      
      // QTY
      const approvedQty = parseInt(item.approved_quantity, 10) || 0;
      doc.text(approvedQty.toString(), colX.qty + colW.qty / 2, currentY + 3.8, { align: 'center' });
      
      // PRICE
      const rate = parseFloat(item.selling_price) || 0;
      doc.text(rate.toFixed(2), colX.price + colW.price / 2, currentY + 3.8, { align: 'center' });
      
      // AMOUNT
      const amount = approvedQty * rate;
      doc.text(amount.toFixed(2), colX.amount + colW.amount / 2, currentY + 3.8, { align: 'center' });
    }
  }

  // --- TOTAL ROW ---
  const totalY = gridStartY + gridHeight;
  const totalRowH = 7;
  
  doc.setDrawColor(0);
  doc.setLineWidth(0.4);
  doc.rect(boxX, totalY, boxW, totalRowH);
  
  // Vertical line for total amount column
  doc.line(colX.amount, totalY, colX.amount, totalY + totalRowH);
  
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text("TOTAL", colX.sno + (colW.sno + colW.desc + colW.qty + colW.price) / 2, totalY + 4.8, { align: 'center' });
  
  // Format total amount
  const finalTotal = parseFloat(order.total_amount) || 0;
  doc.text(finalTotal.toFixed(2), colX.amount + colW.amount / 2, totalY + 4.8, { align: 'center' });

  // --- DISCOUNT ROW IF APPLICABLE ---
  // If there was a discount, we'll draw a small note below the table or adjust total
  if (order.discount_amount > 0) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.text(`*Applied Discount: -${order.discount_amount.toFixed(2)} | Subtotal: ${order.subtotal_amount.toFixed(2)}`, boxX + 2, totalY + 11);
  }

  // --- FOOTER SECTION ---
  const footerY = totalY + 15;
  
  // Left bank details
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9.5);
  doc.setTextColor(210, 20, 20); // Red
  doc.text(bankName, boxX, footerY);
  
  doc.setTextColor(0);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.text(bankAccount, boxX, footerY + 5);
  
  // Center declaration
  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.setTextColor(210, 20, 20); // Red
  doc.text("CERTIFIED THAT THE PARTICULES GIVEN BELOW ARE TRUE", pageWidth - 105, footerY, { align: 'center' });
  
  doc.setTextColor(0);
  doc.setFont("helvetica", "normal");
  doc.text(bankIfsc, pageWidth - 105, footerY + 5, { align: 'center' });
  
  // Right Authorized Signature
  doc.setFont("helvetica", "bold");
  doc.text("AUTHORISED SIGNATURE", pageWidth - 38, footerY + 15, { align: 'center' });
  
  // Draw signature line helper
  doc.setDrawColor(150, 150, 150);
  doc.line(pageWidth - 60, footerY + 12, pageWidth - 15, footerY + 12);

  // Save the PDF
  const filename = `${order.customer_name.replace(/\s+/g, '_')}_Bill_${order.enquiry_id}.pdf`;
  doc.save(filename);
}
