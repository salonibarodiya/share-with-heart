const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// 1. Database Connection
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/donationDB')
  .then(() => console.log('🚀 Premium DB Connected'))
  .catch(err => console.log('❌ DB Connection Error:', err));

// 2. Database Schemas
const DonationSchema = new mongoose.Schema({
  itemType: { type: String, required: true },
  quantity: { type: Number, required: true },
  pickupAddress: { type: String, required: true },
  scheduledTime: { type: String, required: true },
  ngoId: { type: String, required: true },
  ngoName: { type: String, required: true },
  donorName: { type: String, default: 'Saloni Barodiya' },
  status: { type: String, default: 'Pending' }
}, { timestamps: true });

const Donation = mongoose.model('Donation', DonationSchema);

// 3. Mock Data for Verified NGOs
const verifiedNGOs = [
  { id: "ngo-1", name: "Goonj Foundation", city: "Bangalore", impact: "Clothes & Relief Supply" },
  { id: "ngo-2", name: "Hope Orphanage", city: "Bangalore", impact: "Children Care & Household Items" },
  { id: "ngo-3", name: "Green Earth Reuse", city: "Bangalore", impact: "Zero Waste Sustainability" }
];

// 4. API Routes
app.get('/api/ngos', (req, res) => {
  res.json({ success: true, ngos: verifiedNGOs });
});

app.post('/api/donations', async (req, res) => {
  try {
    const { itemType, quantity, pickupAddress, scheduledTime, ngoId } = req.body;
    const selectedNgo = verifiedNGOs.find(n => n.id === ngoId) || verifiedNGOs[0];
    
    const newDonation = new Donation({
      itemType, quantity, pickupAddress, scheduledTime,
      ngoId: selectedNgo.id,
      ngoName: selectedNgo.name
    });
    
    await newDonation.save();
    res.json({ success: true, donation: newDonation });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.get('/api/donations', async (req, res) => {
  try {
    const donations = await Donation.find().sort({ createdAt: -1 });
    res.json({ success: true, donations });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

app.put('/api/donations/:id', async (req, res) => {
  try {
    const { status } = req.body;
    const updated = await Donation.findByIdAndUpdate(req.params.id, { status }, { new: true });
    res.json({ success: true, donation: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// 5. Serve React Build (Handles local production test fallback)
app.use(express.static(path.join(__dirname, '../client/build')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
});

// FIX FOR VERCEL SERVERLESS BUILD: Port listener toggles off during deployment functions
if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

// FIX FOR VERCEL SERVERLESS BUILD: Export app instance for direct route mappings
module.exports = app;