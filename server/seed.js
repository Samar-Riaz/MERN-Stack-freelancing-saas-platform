import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import Job from './models/Job.js';
import Bid from './models/Bid.js';

dotenv.config();

const sampleUsers = [
  {
    name: "Admin User",
    email: "admin@pandahire.com",
    password: "$2a$10$examplehashedpassword", // Hash of "password123"
    role: "admin",
    skills: ["management", "recruiting"],
    rating: 5
  },
  {
    name: "John Doe",
    email: "john@freelancer.com",
    password: "$2a$10$examplehashedpassword",
    role: "freelancer",
    skills: ["react", "node.js"],
    rating: 4.5
  }
];

const jobTitles = [
  'Build a React App', 'Design a Logo', 'Develop REST API', 'Create Landing Page', 'Fix Website Bugs',
  'Write Blog Articles', 'Mobile App UI Design', 'E-commerce Website', 'SEO Optimization', 'WordPress Customization',
  'Data Analysis Script', 'Social Media Banners', 'Migrate Database', 'Setup CI/CD Pipeline', 'Create Marketing Video',
  'Translation Project', 'Build Portfolio Site', 'Integrate Payment Gateway', 'Custom CRM System', 'Landing Page Animation'
];

const categories = [
  'Web Development', 'Design', 'Writing', 'Mobile Development', 'Marketing',
  'Data Science', 'DevOps', 'Translation', 'Video Production', 'SEO'
];

function randomFromArray(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomBudget() {
  return Math.floor(Math.random() * 900 + 100); // 100 - 1000
}

function randomDeadline() {
  const days = Math.floor(Math.random() * 20 + 3); // 3-22 days from now
  return new Date(Date.now() + days * 24 * 60 * 60 * 1000);
}

function randomDescription(title) {
  return `Looking for a skilled freelancer to ${title.toLowerCase()}. Please provide examples of previous work and your approach to this project.`;
}

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log('✅ DB Connected for seeding');
    
    // Clear existing data
    await User.deleteMany();
    await Job.deleteMany();
    await Bid.deleteMany();
    
    // Insert users and get their IDs
    const createdUsers = await User.insertMany(sampleUsers);
    const admin = createdUsers.find(u => u.role === 'admin');
    const freelancer = createdUsers.find(u => u.role === 'freelancer');
    
    // Generate 20 random jobs
    const jobs = [];
    for (let i = 0; i < 20; i++) {
      const title = jobTitles[i % jobTitles.length];
      jobs.push({
        title,
        description: randomDescription(title),
        budget: randomBudget(),
        deadline: randomDeadline(),
        category: randomFromArray(categories),
        poster_id: admin._id
      });
    }
    const createdJobs = await Job.insertMany(jobs);
    
    // Create sample bids for the first job
    await Bid.create({
      job_id: createdJobs[0]._id,
      user_id: freelancer._id,
      bid_amount: 800,
      message: "I can deliver in 2 weeks",
      timeline: "2 weeks"
    });
    
    console.log('🌱 Database seeded successfully!');
    process.exit();
  } catch (err) {
    console.error('Seeding error:', err);
    process.exit(1);
  }
};

seedDB();