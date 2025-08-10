# Dhanvantari Ayurveda - Professional Management System

A comprehensive healthcare management system built with Next.js, TypeScript, and Prisma, specifically designed for Ayurvedic clinics and wellness centers.

## 🚀 Features

### Core Management Modules

#### 1. **Advanced Analytics & Reporting Dashboard**
- Real-time KPI monitoring with trend analysis
- Revenue analytics with monthly/daily breakdowns
- Patient demographics and growth metrics
- Appointment status tracking and room utilization
- Doctor performance analytics
- Interactive charts and visualizations using Recharts

#### 2. **Role-Based Access Control (RBAC)**
- **Super Admin**: Full system access
- **Admin**: Complete management capabilities
- **Doctor**: Patient care, prescriptions, medical records
- **Nurse**: Patient support, vital signs, basic care
- **Receptionist**: Appointments, patient registration, billing
- **Pharmacist**: Prescription management, inventory
- **Accountant**: Financial management, invoices, payments
- **Patient**: Limited access to own records

#### 3. **Inventory Management System**
- Complete Ayurvedic medicine and herb tracking
- Stock level monitoring with automatic alerts
- Purchase order management
- Supplier management
- Expiry date tracking
- Cost and selling price management
- Location-based inventory tracking

#### 4. **Enhanced Patient Management**
- Comprehensive patient profiles
- Medical history tracking
- Family history documentation
- Lifestyle assessment
- Allergy and intolerance registry
- Vital signs monitoring
- Insurance information management

#### 5. **Advanced Appointment System**
- Multiple appointment types (Consultation, Follow-up, Emergency, etc.)
- Room allocation and management
- Doctor assignment and scheduling
- Duration tracking
- Status management (Pending, Confirmed, Completed, etc.)

#### 6. **Digital Prescription Management**
- Electronic prescription creation
- Medicine database integration
- Dosage and frequency tracking
- Prescription sharing capabilities
- Follow-up scheduling
- Prescription history

#### 7. **Comprehensive Billing System**
- Invoice generation and management
- Payment processing and tracking
- Multiple payment methods
- Financial reporting
- Outstanding payment alerts
- Tax and discount management

#### 8. **Clinical Tools**
- Vital signs recording and tracking
- Medical history documentation
- Allergy management
- Lifestyle assessment tools
- Clinical encounter notes

#### 9. **Audit & Compliance**
- Complete audit logging
- User activity tracking
- Data change history
- Compliance reporting
- System settings management

#### 10. **Notification System**
- Real-time notifications
- Priority-based alerting
- Appointment reminders
- Stock alerts
- Payment notifications

## 🛠 Technology Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **Database**: MySQL with Prisma ORM
- **Authentication**: NextAuth.js
- **Charts**: Recharts
- **Icons**: Lucide React
- **Forms**: React Hook Form with Zod validation
- **State Management**: React Context + Hooks

## 📊 Database Schema

### Core Entities
- **Users**: Multi-role user management
- **Patients**: Comprehensive patient records
- **Appointments**: Scheduling and management
- **Prescriptions**: Digital prescription system
- **Invoices**: Billing and payments
- **Inventory**: Stock management
- **Medical Records**: Clinical data
- **Audit Logs**: System activity tracking

### Enhanced Features
- **Role-based permissions**
- **Audit trails**
- **Real-time notifications**
- **Advanced search and filtering**
- **Export capabilities**
- **Mobile-responsive design**

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- MySQL 8.0+
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd dhanvantari-ayurveda
```

2. **Install dependencies**
```bash
npm install
```

3. **Environment Setup**
Create a `.env` file with the following variables:
```env
DATABASE_URL="mysql://username:password@localhost:3306/hms_system"
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"
```

4. **Database Setup**
```bash
npx prisma migrate dev
npx prisma generate
```

5. **Seed the database** (optional)
```bash
npm run prisma:seed
```

6. **Start the development server**
```bash
npm run dev
```

## 📁 Project Structure

```
dhanvantari-ayurveda/
├── app/                    # Next.js app directory
│   ├── (auth)/            # Authentication pages
│   ├── api/               # API routes
│   ├── dashboard/         # Dashboard pages
│   └── globals.css        # Global styles
├── components/            # React components
│   ├── dashboard/         # Dashboard-specific components
│   ├── home/             # Home page components
│   ├── layout/           # Layout components
│   └── ui/               # Reusable UI components
├── lib/                  # Utility libraries
│   ├── permissions.ts    # RBAC system
│   ├── prisma.ts         # Database client
│   └── utils.ts          # Utility functions
├── prisma/               # Database schema and migrations
└── public/               # Static assets
```

## 🔐 Security Features

- **Role-based access control**
- **JWT authentication**
- **Password hashing with bcrypt**
- **CSRF protection**
- **Input validation and sanitization**
- **Audit logging**
- **Session management**

## 📈 Analytics & Reporting

### Dashboard Metrics
- Total patients and growth trends
- Appointment statistics
- Revenue analytics
- Inventory status
- Doctor performance
- Room utilization

### Export Capabilities
- Patient data export
- Financial reports
- Inventory reports
- Audit logs
- Custom date range reports

## 🔧 Configuration

### System Settings
- Clinic information
- Default values
- Notification preferences
- User permissions
- Backup settings

### Customization
- Branding and theming
- Email templates
- Report formats
- Workflow configurations

## 🚀 Deployment

### Production Build
```bash
npm run build
npm start
```

### Environment Variables for Production
```env
DATABASE_URL="production-database-url"
NEXTAUTH_SECRET="production-secret"
NEXTAUTH_URL="https://your-domain.com"
```

## 📱 Mobile Responsiveness

The system is fully responsive and optimized for:
- Desktop computers
- Tablets
- Mobile phones
- Touch interfaces

## 🔄 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### Patients
- `GET /api/patients` - List patients
- `POST /api/patients` - Create patient
- `GET /api/patients/[id]` - Get patient details
- `PUT /api/patients/[id]` - Update patient
- `DELETE /api/patients/[id]` - Delete patient

### Appointments
- `GET /api/appointments` - List appointments
- `POST /api/appointments` - Create appointment
- `PUT /api/appointments/[id]` - Update appointment
- `DELETE /api/appointments/[id]` - Delete appointment

### Prescriptions
- `GET /api/prescriptions` - List prescriptions
- `POST /api/prescriptions` - Create prescription
- `GET /api/prescriptions/[id]` - Get prescription details

### Inventory
- `GET /api/inventory` - List inventory items
- `POST /api/inventory` - Add inventory item
- `PUT /api/inventory/[id]` - Update inventory item

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

## 🔮 Future Enhancements

- **Telemedicine integration**
- **Mobile app development**
- **AI-powered diagnostics**
- **Advanced analytics**
- **Third-party integrations**
- **Multi-language support**
- **Advanced reporting**
- **API for external systems**

---

**Dhanvantari Ayurveda** - Empowering Ayurvedic healthcare with modern technology.
