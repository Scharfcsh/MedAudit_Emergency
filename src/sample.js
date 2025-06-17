import { Calendar, Phone, Mail, MapPin, Heart, Shield, FileText, User, AlertTriangle, CheckCircle } from "lucide-react"

// Mock data based on the API response structure
const patientData = {
  status: true,
  code: 200,
  message: "Documents retrieved with anonymous access",
  data: {
    session: {
      id: 13,
      session_token: "uO3eV9376ixkeb4THRFAhhTAVGPiE4wYmkfb3HJ_FXY",
      session_type: "anonymous",
      expires_at: "2025-06-17T22:04:42.806953Z",
      is_valid: true,
      access_level: "Emergency Access Only",
    },
    patient: {
      patient_id: 3,
      name: "Kaushik Shahare",
      gender: "Male",
      date_of_birth: "1995-07-12",
      age: 29,
      email: "kaushikshahare2@gmail.com",
      phone_number: "9359139756",
      location: "Mumbai, Maharashtra",
      address: {
        street: "B-201, Sagar Heights",
        area: "Andheri East",
        city: "Mumbai",
        state: "Maharashtra",
        pincode: "400069",
        country: "India",
      },
      blood_group: "B+",
      height_cm: 172,
      weight_kg: 68,
      marital_status: "Single",
      emergency_contact: {
        name: "Rajesh Shahare",
        relation: "Father",
        phone_number: "9823123456",
      },
      insurance: {
        provider: "Star Health Insurance",
        policy_number: "STH12345678",
        valid_till: "2026-03-31",
      },
      allergies: ["Penicillin"],
      chronic_conditions: ["Asthma"],
      current_medications: ["Inhaler (Salbutamol)"],
      last_visit: "2025-05-30",
      primary_physician: {
        name: "Dr. Neha Mehta",
        department: "Pulmonology",
        hospital: "Apollo Hospitals, Mumbai",
      },
      vaccination_status: {
        covid19: "Completed",
        hepatitis_b: "Completed",
        tetanus: "Completed",
      },
    },
    documents: [
      {
        id: 1,
        patient_name: "Kaushik",
        file: "https://res.cloudinary.com/dyvriwexb/raw/upload/v1/medaudit/documents/script_uhs7ac.txt",
        description: "This is a test document",
        uploaded_at: "2025-06-17T08:44:03.177910Z",
        is_approved: true,
        is_emergency_accessible: true,
        document_type: "",
        patient: 3,
        uploaded_by: 3,
      },
    ],
    document_count: 1,
  },
}

export default function PatientProfile() {
  const { patient, session, documents } = patientData.data

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const calculateAge = (birthDate) => {
    const today = new Date()
    const birth = new Date(birthDate)
    let age = today.getFullYear() - birth.getFullYear()
    const monthDiff = today.getMonth() - birth.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--
    }
    return age
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{patient.name}</h1>
                <p className="text-sm text-gray-500">Patient ID: #{patient.patient_id}</p>
              </div>
            </div>
            <div className="mt-4 sm:mt-0">
              <div className="flex items-center space-x-2 px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm font-medium">
                <AlertTriangle className="w-4 h-4" />
                <span>{session.access_level}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Personal Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <User className="w-5 h-5 mr-2 text-blue-600" />
                Personal Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Full Name</label>
                    <p className="text-gray-900 font-medium">{patient.name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Gender</label>
                    <p className="text-gray-900">{patient.gender}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Date of Birth</label>
                    <p className="text-gray-900 flex items-center">
                      <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                      {formatDate(patient.date_of_birth)} ({patient.age} years)
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Marital Status</label>
                    <p className="text-gray-900">{patient.marital_status}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Email</label>
                    <p className="text-gray-900 flex items-center">
                      <Mail className="w-4 h-4 mr-2 text-gray-400" />
                      {patient.email}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Phone</label>
                    <p className="text-gray-900 flex items-center">
                      <Phone className="w-4 h-4 mr-2 text-gray-400" />
                      {patient.phone_number}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Blood Group</label>
                    <p className="text-gray-900 font-semibold text-red-600">{patient.blood_group}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Height / Weight</label>
                    <p className="text-gray-900">
                      {patient.height_cm} cm / {patient.weight_kg} kg
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Address Information */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <MapPin className="w-5 h-5 mr-2 text-blue-600" />
                Address Information
              </h2>
              <div className="text-gray-900">
                <p>{patient.address.street}</p>
                <p>
                  {patient.address.area}, {patient.address.city}
                </p>
                <p>
                  {patient.address.state} - {patient.address.pincode}
                </p>
                <p>{patient.address.country}</p>
              </div>
            </div>

            {/* Medical Information */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Heart className="w-5 h-5 mr-2 text-teal-600" />
                Medical Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Allergies</h3>
                  <div className="space-y-1">
                    {patient.allergies.map((allergy, index) => (
                      <span
                        key={index}
                        className="inline-block px-2 py-1 bg-red-100 text-red-800 text-sm rounded-full mr-2"
                      >
                        <AlertTriangle className="w-3 h-3 inline mr-1" />
                        {allergy}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900 mb-2">Chronic Conditions</h3>
                  <div className="space-y-1">
                    {patient.chronic_conditions.map((condition, index) => (
                      <span
                        key={index}
                        className="inline-block px-2 py-1 bg-orange-100 text-orange-800 text-sm rounded-full mr-2"
                      >
                        {condition}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="mt-4">
                <h3 className="font-medium text-gray-900 mb-2">Current Medications</h3>
                <div className="space-y-1">
                  {patient.current_medications.map((medication, index) => (
                    <span
                      key={index}
                      className="inline-block px-2 py-1 bg-green-100 text-green-800 text-sm rounded-full mr-2"
                    >
                      {medication}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Vaccination Status */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Shield className="w-5 h-5 mr-2 text-green-600" />
                Vaccination Status
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {Object.entries(patient.vaccination_status).map(([vaccine, status]) => (
                  <div key={vaccine} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <span className="text-sm font-medium text-gray-900 capitalize">{vaccine.replace("_", " ")}</span>
                    <div className="flex items-center text-green-600">
                      <CheckCircle className="w-4 h-4 mr-1" />
                      <span className="text-sm font-medium">{status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Emergency Contact, Insurance, Documents */}
          <div className="space-y-6">
            {/* Emergency Contact */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Phone className="w-5 h-5 mr-2 text-red-600" />
                Emergency Contact
              </h2>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-500">Name</label>
                  <p className="text-gray-900 font-medium">{patient.emergency_contact.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Relation</label>
                  <p className="text-gray-900">{patient.emergency_contact.relation}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Phone</label>
                  <p className="text-gray-900 font-medium">{patient.emergency_contact.phone_number}</p>
                </div>
              </div>
            </div>

            {/* Insurance Information */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Shield className="w-5 h-5 mr-2 text-blue-600" />
                Insurance Information
              </h2>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-500">Provider</label>
                  <p className="text-gray-900 font-medium">{patient.insurance.provider}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Policy Number</label>
                  <p className="text-gray-900 font-mono">{patient.insurance.policy_number}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Valid Till</label>
                  <p className="text-gray-900">{formatDate(patient.insurance.valid_till)}</p>
                </div>
              </div>
            </div>

            {/* Primary Physician */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <User className="w-5 h-5 mr-2 text-teal-600" />
                Primary Physician
              </h2>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-500">Doctor</label>
                  <p className="text-gray-900 font-medium">{patient.primary_physician.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Department</label>
                  <p className="text-gray-900">{patient.primary_physician.department}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Hospital</label>
                  <p className="text-gray-900">{patient.primary_physician.hospital}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Last Visit</label>
                  <p className="text-gray-900">{formatDate(patient.last_visit)}</p>
                </div>
              </div>
            </div>

            {/* Documents */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <FileText className="w-5 h-5 mr-2 text-navy-600" />
                Documents ({documents.length})
              </h2>
              <div className="space-y-3">
                {documents.map((doc) => (
                  <div key={doc.id} className="border border-gray-200 rounded-lg p-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{doc.description}</p>
                        <p className="text-xs text-gray-500 mt-1">Uploaded: {formatDate(doc.uploaded_at)}</p>
                        <div className="flex items-center mt-2 space-x-2">
                          {doc.is_approved && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Approved
                            </span>
                          )}
                          {doc.is_emergency_accessible && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                              Emergency Access
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
