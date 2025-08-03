import React, { useEffect, useState } from "react";
import axios from "axios";
import SessionCard from "../components/SessionCardsd";
import { CircularProgress } from "@mui/material";
import SentimentDissatisfiedIcon from "@mui/icons-material/SentimentDissatisfied";

const AllPosts = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllSessions = async () => {
      try {
        const res = await axios.get("https://healthhub-backend-sldu.onrender.com/all-posts");
        if (res.data.success) {
          setSessions(res.data.sessions);
        } else {
          setSessions([]);
        }
      } catch (err) {
        console.error("Error fetching all posts", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllSessions();
  }, []);

  return (
    <>

      <main className="max-w-screen-lg mx-auto px-4 sm:px-6 lg:px-8 py-12 min-h-[70vh]" style={{marginTop:"5rem"}} >
        <div className="mb-10 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-2">
            Explore Wellness Sessions
          </h1>
          <p className="text-gray-500 text-sm sm:text-base">
            Discover wellness content shared by the community.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center mt-20">
            <CircularProgress />
          </div>
        ) : sessions.length === 0 ? (
          <div className="text-center text-gray-500 mt-16 flex flex-col items-center gap-2">
            <SentimentDissatisfiedIcon fontSize="large" color="disabled" />
            <p>No published sessions yet.</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {sessions.map((session) => (
              <SessionCard key={session._id} session={session} showEdit={false} />
            ))}
          </div>
        )}
      </main>

    </>
  );
};

export default AllPosts;
