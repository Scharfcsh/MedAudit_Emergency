"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import {
  Calendar,
  Phone,
  Mail,
  MapPin,
  Heart,
  Shield,
  FileText,
  User,
  AlertTriangle,
  CheckCircle,
  Loader2,
} from "lucide-react";
export default function PatientProfile() {
  const patientt = {
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
  };
  const searchParams = useSearchParams();
  const [patientData, setPatientData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get session token from URL params or use default
  const cardId =
    searchParams.get("card_id") ;

  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        setLoading(true);
        setError(null);
        const tapResponse = await fetch(
          `https://medaudit.onrender.com/api/ehr/nfc/tap/${cardId}/`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const tapData = await tapResponse.json();
        console.log("Tap Data:", tapData.data.session.session_token);
        const sessionToken =tapData.data.session.session_token;

        const response = await fetch(
          `https://medaudit.onrender.com/api/ehr/nfc/session/${sessionToken}/documents/`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          setPatientData(patientt);
          return;
          // throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json();

        if (!data.status) {
          throw new Error(data.message || "Failed to fetch patient data");
        }

        setPatientData(data);
      } catch (err) {
        console.error("Error fetching patient data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPatientData();
  }, [cardId]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const calculateAge = (birthDate) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birth.getDate())
    ) {
      age--;
    }
    return age;
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading patient data...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-lg shadow-sm border border-gray-200 max-w-md">
          <AlertTriangle className="w-12 h-12 mx-auto mb-4 text-red-600" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Error Loading Data
          </h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // No data state
  if (!patientData || !patientData.data) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-12 h-12 mx-auto mb-4 text-yellow-600" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            No Data Available
          </h2>
          <p className="text-gray-600">Unable to load patient information.</p>
        </div>
      </div>
    );
  }

  const { patient: patientInfo, session, documents } = patientData.data;
  const patient = patientInfo.profile; // Extract profile data

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
                <h1 className="text-2xl font-bold text-gray-900">
                  {patient.name}
                </h1>
                <p className="text-sm text-gray-500">
                  Patient ID: #{patient.patient_id}
                </p>
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
                    <label className="text-sm font-medium text-gray-500">
                      Full Name
                    </label>
                    <p className="text-gray-900 font-medium">{patient.name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Gender
                    </label>
                    <p className="text-gray-900">{patient.gender}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Date of Birth
                    </label>
                    <p className="text-gray-900 flex items-center">
                      <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                      {formatDate(patient.date_of_birth)} ({patient.age} years)
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Marital Status
                    </label>
                    <p className="text-gray-900">{patient.marital_status}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Email
                    </label>
                    <p className="text-gray-900 flex items-center">
                      <Mail className="w-4 h-4 mr-2 text-gray-400" />
                      {patient.email}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Phone
                    </label>
                    <p className="text-gray-900 flex items-center">
                      <Phone className="w-4 h-4 mr-2 text-gray-400" />
                      {patient.phone_number}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Blood Group
                    </label>
                    <p className="text-red-600 font-semibold">
                      {patient.blood_group}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Height / Weight
                    </label>
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
                <p>{patient?.address?.street}</p>
                <p>
                  {patient?.address?.area}, {patient?.address?.city}
                </p>
                <p>
                  {patient?.address?.state} - {patient?.address?.pincode}
                </p>
                <p>{patient?.address?.country}</p>
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
                    {patient?.allergies?.map((allergy, index) => (
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
                  <h3 className="font-medium text-gray-900 mb-2">
                    Chronic Conditions
                  </h3>
                  <div className="space-y-1">
                    {patient?.chronic_conditions?.map((condition, index) => (
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
                <h3 className="font-medium text-gray-900 mb-2">
                  Current Medications
                </h3>
                <div className="space-y-1">
                  {patient?.current_medications?.map((medication, index) => (
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
                {patient?.vaccination_status && Object.keys(patient.vaccination_status).length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {Object.entries(patient.vaccination_status).map(([vaccine, status]) => (
                            <div
                                key={vaccine}
                                className="flex items-center justify-between p-3 bg-green-50 rounded-lg"
                            >
                                <span className="text-sm font-medium text-gray-900 capitalize">
                                    {vaccine.replace("_", " ")}
                                </span>
                                <div className="flex items-center text-green-600">
                                    <CheckCircle className="w-4 h-4 mr-1" />
                                    <span className="text-sm font-medium">{status}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500">No vaccination records available</p>
                )}
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
                  <label className="text-sm font-medium text-gray-500">
                    Name
                  </label>
                  <p className="text-gray-900 font-medium">
                    {patient?.emergency_contact?.name}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Relation
                  </label>
                  <p className="text-gray-900">
                    {patient?.emergency_contact?.relation}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Phone
                  </label>
                  <p className="text-gray-900 font-medium">
                    {patient?.emergency_contact?.phone_number}
                  </p>
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
                  <label className="text-sm font-medium text-gray-500">
                    Provider
                  </label>
                  <p className="text-gray-900 font-medium">
                    {patient?.insurance?.provider}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Policy Number
                  </label>
                  <p className="text-gray-900 font-mono">
                    {patient?.insurance?.policy_number}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Valid Till
                  </label>
                  <p className="text-gray-900">
                    {formatDate(patient?.insurance?.valid_till)}
                  </p>
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
                  <label className="text-sm font-medium text-gray-500">
                    Doctor
                  </label>
                  <p className="text-gray-900 font-medium">
                    {patient?.primary_physician?.name === "Dr. Unknown" 
                      ? "Not assigned" 
                      : patient?.primary_physician?.name}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Department
                  </label>
                  <p className="text-gray-900">
                    {patient?.primary_physician?.department}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Hospital
                  </label>
                  <p className="text-gray-900">
                    {patient?.primary_physician?.hospital}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Last Visit
                  </label>
                  <p className="text-gray-900">
                    {patient?.last_visit ? formatDate(patient.last_visit) : "No recent visits"}
                  </p>
                </div>
              </div>
            </div>

            {/* Documents */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <FileText className="w-5 h-5 mr-2 text-navy-600" />
                Documents ({documents?.length})
              </h2>
              <div className="space-y-3">
                {documents?.map((doc) => (
                  <div
                    key={doc.id}
                    className="border border-gray-200 rounded-lg p-3"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">
                          {doc.description}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Uploaded: {formatDate(doc.uploaded_at)}
                        </p>
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
  );
}
