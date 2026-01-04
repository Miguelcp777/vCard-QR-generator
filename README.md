# Johnson & Johnson Mobile QR Card Generator

A modern, mobile-first web application for generating professional vCard QR codes. Designed for Johnson & Johnson representatives to easily share their contact information digitally.

![App Preview](./screenshot.png)

## Features

- **Mobile-First Design**: Optimized for seamless use on smartphones.
- **Real-time Preview**: See changes instantly as you edit the card.
- **High-Quality Export**:
  - **Save as Image (PNG)**: Ultra-high resolution (4x scale) using `html-to-image` for pixel-perfect clarity.
  - **Save as PDF**: Ready-to-print format.
  - **Anti-aliasing**: Sharp text and perfect circular avatars.
- **vCard 3.0 Support**: Generated QR codes are compatible with iOS and Android contacts.
- **Offline Generation**: All processing happens locally in the browser for speed and privacy.

## Tech Stack

- **Framework**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide React
- **QR Code**: `qrcode.react`
- **Export Engine**: `html-to-image` (replaced `html2canvas` for superior quality)
- **PDF Generation**: `jspdf`

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Miguelcp777/vCard-QR-generator.git
   ```

2. Navigate to the project directory:
   ```bash
   cd vCard-QR-generator
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## Usage

1. **Edit**: Fill in your First Name, Last Name, Job Title, and Contact Details. Use the **Pencil Icon** to upload/change your photo.
2. **Preview**: Switch to the "Preview" tab to see the final card design. You can also edit the photo directly here.
3. **Export**: Click "Save Image" to download a high-resolution PNG or "Save PDF" for a document version.

## License

Private / Internal Use.
