import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import Certificate from '../models/Certificate.js';
import User from '../models/User.js';
import Job from '../models/Job.js';

// Fix for __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const generateCertificate = async (req, res) => {
  try {
    const { jobId, userId } = req.body;
    
    // Validate inputs
    if (!jobId || !userId) {
      return res.status(400).json({ msg: 'Missing jobId or userId' });
    }

    const [job, user] = await Promise.all([
      Job.findById(jobId),
      User.findById(userId)
    ]);

    if (!job || !user) {
      return res.status(404).json({ msg: 'Job or user not found' });
    }

    // Verify requester is job poster
    if (job.poster_id.toString() !== req.user.id) {
      return res.status(403).json({ msg: 'Not authorized' });
    }

    // Create certificates directory if it doesn't exist
    const certDir = path.join(__dirname, '../uploads/certificates');
    if (!fs.existsSync(certDir)) {
      fs.mkdirSync(certDir, { recursive: true });
    }

    // Generate PDF
    const certId = Date.now();
    const fileName = `certificate_${certId}.pdf`;
    const filePath = path.join(certDir, fileName);
    const doc = new PDFDocument();

    // Create write stream
    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);

    // PDF Content
    doc.fontSize(25).text('Certificate of Completion', { align: 'center' });
    doc.moveDown();
    doc.fontSize(18).text(`This certifies that ${user.name}`, { align: 'center' });
    doc.moveDown();
    doc.fontSize(16).text(`has successfully completed the job:`, { align: 'center' });
    doc.moveDown();
    doc.fontSize(20).text(`"${job.title}"`, { align: 'center', underline: true });
    doc.moveDown();
    doc.fontSize(14).text(`Issued on: ${new Date().toLocaleDateString()}`, { align: 'center' });
    
    // Finalize PDF
    doc.end();

    // Wait for stream to finish
    await new Promise((resolve) => stream.on('finish', resolve));

    // Save certificate record
    const certificate = await Certificate.create({
      job_id: jobId,
      user_id: userId,
      pdf_url: `/certificates/${fileName}`
    });

    res.status(201).json(certificate);

  } catch (err) {
    console.error('CERTIFICATE ERROR:', err);
    res.status(500).json({ msg: 'Server error' });
  }
};