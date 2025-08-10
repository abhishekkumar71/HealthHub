import React, { useEffect, useState } from "react";
import axios from "axios";
import SessionCard from "../components/SessionCard";
import { CircularProgress, Icon } from "@mui/material";
import SentimentDissatisfiedIcon from "@mui/icons-material/SentimentDissatisfied";
import styles from "../styles/pages.module.css";
import SearchIcon from "@mui/icons-material/Search";
const AllPosts = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredSessions = sessions.filter((session) => {
    const term = searchTerm.toLowerCase();
    return (
      session.title.toLowerCase().includes(term) ||
      session.tags.some((tag) => tag.toLowerCase().includes(term))
    );
  });

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
      <div className={styles.searchBar}>
        <input
          type="text"
          placeholder="Search by title or tags..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={styles.searchInput}
        />
        <SearchIcon sx={{marginRight:"5px"}}/>
      </div>
      <main
        className="max-w-screen-lg mx-auto px-4 sm:px-6 lg:px-8 py-12 min-h-[70vh]"
        style={{ marginTop: "4rem", padding: "1rem",width:"95%" }}
      >
        <div
          className="mb-10 text-center"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-2">
            Explore Wellness Sessions
          </h1>
          <p className="text-gray-500 text-sm sm:text-base max-w-xl">
            Discover content that promotes physical health, mental well-being,
            emotional balance, and self-care shared by the community.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center mt-20">
            <CircularProgress />
          </div>
        ) : filteredSessions.length === 0 ? (
          <div className="text-center text-gray-500 mt-16 flex flex-col items-center gap-2">
            <SentimentDissatisfiedIcon fontSize="large" color="disabled" />
            <p>No sessions found.</p>
          </div>
        ) : (
          <div className={styles.postsGrid}>
            {filteredSessions.map((session) => (
              <div key={session._id} className="h-full">
                <SessionCard session={session} />
              </div>
            ))}
          </div>
        )}
      </main>
    </>
  );
};

export default AllPosts;
