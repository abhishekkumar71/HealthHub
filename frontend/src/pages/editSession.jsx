import React from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import SessionForm from "../components/sessionForm";

const EditSession = () => {
  const { id } = useParams();

  return (
    <>
      <Navbar />
      <div className="min-h-screen pt-6 pb-20 px-4">
        <h1 className="text-2xl font-semibold mb-4">Edit Session</h1>
        <SessionForm sessionId={id} isEdit />
      </div>
      <Footer />
    </>
  );
};

export default EditSession;
