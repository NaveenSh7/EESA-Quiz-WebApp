import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";
import "./PageTwo.css";

function MultipleQuestions() {
  const navigate = useNavigate();
  const { user, isAuthenticated, isLoading } = useAuth0();

  const [questions, setQuestions] = useState([]);
  const [ans1, setAns1] = useState(""); // Answer for question 1
  const [ans2, setAns2] = useState(""); // Answer for question 2
  const [ans3, setAns3] = useState(""); // Answer for question 3
  const [verify1, setVerify1] = useState(null); // Verification result for question 1
  const [verify2, setVerify2] = useState(null); // Verification result for question 2
  const [verify3, setVerify3] = useState(null); // Verification result for question 3
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(""); // Error message

  const [userInfo, setUserInfo] = useState(null);
  const [isSolved2, setIsSolved2] = useState(false);
  const [isSolved3, setIsSolved3] = useState(false);
  const [isSolved4, setIsSolved4] = useState(false);

  // Fetch questions from the backend
  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const questionNumbers = [2, 3, 4];
      const fetchedQuestions = [];

      for (let i = 0; i < questionNumbers.length; i++) {
        const response = await axios.get("http://localhost:5000/Fetch_Question", {
          params: { Q_Num: questionNumbers[i], userEmail: user.email },
        });
        fetchedQuestions.push(response.data);
      }

      setQuestions(fetchedQuestions);
    } catch (err) {
      console.error("Error fetching questions:", err);
      // setError("Failed to load questions. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  const handleVerify = async (questionNo, answer) => {
    if (!answer) {
      setError("Please enter an answer before verifying.");
      return;
    }

    if (!isAuthenticated || !user?.email) {
      setError("User authentication failed. Please log in.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/validateAnswer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          Qno: questionNo,
          submittedAns: answer,
          userEmail: user.email,
        }),
      });

      const data = await response.json();
      if (questionNo === 2) setVerify1(data.isCorrect);
      if (questionNo === 3) setVerify2(data.isCorrect);
      if (questionNo === 4) setVerify3(data.isCorrect);

      setError(null); // Clear error if any
    } catch (err) {
      console.error("Error verifying answer:", err);
      setError("There was an error verifying the answer. Please try again.");
    }
  };



  //getting user info
  const LoadUser = async () => {
    if (isAuthenticated && user?.email) {
      try {
        // Sending the email as a query parameter in the GET request
        const response = await axios.get(`http://localhost:5000/getUserInfo`, {
          params: { email: user.email },  // Email is sent as a query parameter
        });

        setUserInfo(response.data);
        setIsSolved2(response.data.Qns_Solved.includes(2));
        setIsSolved3(response.data.Qns_Solved.includes(3));
        setIsSolved4(response.data.Qns_Solved.includes(4));

      } catch (err) {
        console.error('Error loading user info:', err);
      }
    }

  };



  // Fetch question when user is ready
  useEffect(() => {
    if (!isLoading && isAuthenticated && user?.email) {
      fetchQuestions(user.email, "01");
    }
    LoadUser();
  }, [isLoading, isAuthenticated, user]);






  const handleNext = async () => {
    await LoadUser();
    const requiredQuestions = [2, 3, 4];
    const isVal = requiredQuestions.every((q) => userInfo.Qns_Solved.includes(q));

    if (isVal) {
      navigate("/page-three");
    } else {
      setError("Please ensure all answers are correct before proceeding.");
    }
  };

  const handlePrevious = () => navigate(-1);

  if (loading) return <div className="loading">Loading questions...</div>;

  return (
    <div className="question-container">
      <h1>Answer the Questions</h1>

      {/* Question 2 */}
      <div className="question-box">
        <div className="question-content">

          <div className="question-header">
            <div style={{ margin: "auto" }}>    <h2 className="question-title"><span style={{ color: "orange" }}>2.</span> {questions[0]?.Q_Title}</h2> </div>
            <span className={isSolved2 ? "solved" : "unsolved"}>
              {isSolved2 ? "Solved!" : "Not solved"}
            </span>
          </div>
          <p className="para1">{questions[0]?.Q_Des}
          <div style={{
          display: 'flex', width: '100%', justifyContent:"center", marginBottom: '20px' ,marginTop:'30px',gap:'40px'
          
        }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ margin: 0, fontSize: '1rem' }}>2a ka description hvvvhjvhvhv hjvhjvhjvjhvh jvhjvhghcgcfg cxgcgh vhgvhvhv cghhjvvv  vvvvvvvvv vvvvvvvvv vvvvvvvv vvvvvvvv vvvvvvv vvvvvvv  vvvvvvv vvvvvvv vvvvvvv vvvvvvv
              vvvv vvv vvvvvv vvvvvvvvv vvvvvv vvvvvvvvvv vvvvvvvvvv vvvvvvv vvvvvvvv
            </p>
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <img
              src={questions[0]?.Q_Img}
              alt="Question 2a"
              style={{ maxWidth: '38%', height: 'auto', display: 'block' }}
            />
          </div>
        </div>

        <div style={{
          display: 'flex', width: '100%', justifyContent:"center", marginBottom: '20px' ,marginTop:'30px',gap:'40px'
          
        }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ margin: 0, fontSize: '1rem' }}>2a ka description hvvvhjvhvhv hjvhjvhjvjhvh jvhjvhghcgcfg cxgcgh vhgvhvhv cghhjvvv  vvvvvvvvv vvvvvvvvv vvvvvvvv vvvvvvvv vvvvvvv vvvvvvv  vvvvvvv vvvvvvv vvvvvvv vvvvvvv
              vvvv vvv vvvvvv vvvvvvvvv vvvvvv vvvvvvvvvv vvvvvvvvvv vvvvvvv vvvvvvvv
            </p>
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <img
              src={questions[0]?.Q_Img}
              alt="Question 2a"
              style={{ maxWidth: '38%', height: 'auto', display: 'block' }}
            />
          </div>
        </div>

        <div style={{
          display: 'flex', width: '100%', justifyContent:"center", marginBottom: '20px' ,marginTop:'30px',gap:'40px'
          
        }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ margin: 0, fontSize: '1rem' }}>2a ka description hvvvhjvhvhv hjvhjvhjvjhvh jvhjvhghcgcfg cxgcgh vhgvhvhv cghhjvvv  vvvvvvvvv vvvvvvvvv vvvvvvvv vvvvvvvv vvvvvvv vvvvvvv  vvvvvvv vvvvvvv vvvvvvv vvvvvvv
              vvvv vvv vvvvvv vvvvvvvvv vvvvvv vvvvvvvvvv vvvvvvvvvv vvvvvvv vvvvvvvv
            </p>
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <img
              src={questions[0]?.Q_Img}
              alt="Question 2a"
              style={{ maxWidth: '38%', height: 'auto', display: 'block' }}
            />
          </div>
        </div>

        <div style={{
          display: 'flex', width: '100%', justifyContent:"center", marginBottom: '20px' ,marginTop:'30px',gap:'40px'
          
        }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ margin: 0, fontSize: '1rem' }}>2a ka description hvvvhjvhvhv hjvhjvhjvjhvh jvhjvhghcgcfg cxgcgh vhgvhvhv cghhjvvv  vvvvvvvvv vvvvvvvvv vvvvvvvv vvvvvvvv vvvvvvv vvvvvvv  vvvvvvv vvvvvvv vvvvvvv vvvvvvv
              vvvv vvv vvvvvv vvvvvvvvv vvvvvv vvvvvvvvvv vvvvvvvvvv vvvvvvv vvvvvvvv
            </p>
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <img
              src={questions[0]?.Q_Img}
              alt="Question 2a"
              style={{ maxWidth: '38%', height: 'auto', display: 'block' }}
            />
          </div>
        </div>

        <div style={{
          display: 'flex', width: '100%', justifyContent:"center", marginBottom: '20px' ,marginTop:'30px',gap:'40px'
          
        }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ margin: 0, fontSize: '1rem' }}>2a ka description hvvvhjvhvhv hjvhjvhjvjhvh jvhjvhghcgcfg cxgcgh vhgvhvhv cghhjvvv  vvvvvvvvv vvvvvvvvv vvvvvvvv vvvvvvvv vvvvvvv vvvvvvv  vvvvvvv vvvvvvv vvvvvvv vvvvvvv
              vvvv vvv vvvvvv vvvvvvvvv vvvvvv vvvvvvvvvv vvvvvvvvvv vvvvvvv vvvvvvvv
            </p>
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <img
              src={questions[0]?.Q_Img}
              alt="Question 2a"
              style={{ maxWidth: '38%', height: 'auto', display: 'block' }}
            />
          </div>
        </div>

          </p>
          {/* <img
            src={questions[0]?.Q_Img}
            alt="Question 1"
            className="question-image"
          /> */}
          

        </div>

        <div className="input-verify-container">
  <input
    type="text"
    placeholder="Your answer"
    value={ans1}
    onChange={(e) => setAns1(e.target.value)}
    onKeyDown={(e) => {
      if (e.key === "Enter") {
        handleVerify(2, ans1); // Pass the question number and answer
      }
    }}
    className="answer-input"
  />
  <button
    onClick={() => handleVerify(2, ans1)}
    className="verify-button"
  >
    Verify
  </button>
</div>

        {verify1 !== null && (
          <p className={`feedback ${verify1 ? "correct" : "incorrect"}`}>
            {verify1 ? "✅ Correct" : "❌ Incorrect"}
          </p>
        )}
      </div>




      {/* Question 3 */}
      <div className="question-box">
        <div className="question-content">

          <div className="question-header">
            <div style={{ margin: "auto" }}>   <h2 className="question-title"><span style={{ color: "orange" }}>3. </span> {questions[1]?.Q_Title}</h2> </div>
            <span className={isSolved3 ? "solved" : "unsolved"}>
              {isSolved3 ? "Solved!" : "Not solved"}
            </span>
          </div>
          <p className="para1">{questions[1]?.Q_Des}</p>
          <img
            src={questions[1]?.Q_Img}
            alt="Question 2"
            className="question-image"
          />
        </div>





        <div className="input-verify-container">
  <input
    type="text"
    placeholder="Your answer"
    value={ans2}
    onChange={(e) => setAns2(e.target.value)}
    onKeyDown={(e) => {
      if (e.key === "Enter") {
        handleVerify(3, ans2); // Pass the question number and answer
      }
    }}
    className="answer-input"
  />
  <button
    onClick={() => handleVerify(3, ans2)}
    className="verify-button"
  >
    Verify
  </button>
</div>

        {verify2 !== null && (
          <p className={`feedback ${verify2 ? "correct" : "incorrect"}`}>
            {verify2 ? "✅ Correct" : "❌ Incorrect"}
          </p>
        )}
      </div>

      {/* Question 4 */}
      <div className="question-box">
        <div className="question-content">

          <div className="question-header">
            <div style={{ margin: "auto" }}>   <h2 className="question-title"><span style={{ color: "orange" }}>4.</span> {questions[2]?.Q_Title}</h2>     </div>
            <span className={isSolved4 ? "solved" : "unsolved"}>
              {isSolved4 ? "Solved!" : "Not solved"}
            </span>
          </div>
          <p className="para1">{questions[2]?.Q_Des}


          <div style={{ display: 'flex', width: '100%', gap: '40px', justifyContent:"center",marginBottom: '20px',marginTop:'30px' }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ margin: 0, fontSize: '1rem' }}>4a ka description Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse.
            </p>
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <img
              src={questions[2]?.Q_Img}
              alt="Question 4a"
              style={{ maxWidth: '38%', height: 'auto', display: 'block' }}
            />
          </div>
        </div>
        <div style={{ display: 'flex', width: '100%', justifyContent:"center", gap: '40px', marginBottom: '20px' }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ margin: 0, fontSize: '1rem' }}>4b ka description</p>
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <img
              src={questions[2]?.Q_Img}
              alt="Question 4b"
              style={{ maxWidth: '38%', height: 'auto', display: 'block' }}
            />
          </div>
        </div>
        <div style={{ display: 'flex', width: '100%', justifyContent:"center", gap: '40px', marginBottom: '20px' }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ margin: 0, fontSize: '1rem' }}>4c ka description</p>
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <img
              src={questions[2]?.Q_Img}
              alt="Question 4c"
              style={{ maxWidth: '38%', height: 'auto', display: 'block' }}
            />
          </div>
        </div>
          </p>

        </div>

       
        <div className="input-verify-container">
  <input
    type="text"
    placeholder="Your answer"
    value={ans3}
    onChange={(e) => setAns3(e.target.value)}
    onKeyDown={(e) => {
      if (e.key === "Enter") {
        handleVerify(4, ans3); // Pass the question number and answer
      }
    }}
    className="answer-input"
  />
  <button
    onClick={() => handleVerify(4, ans3)}
    className="verify-button"
  >
    Verify
  </button>
</div>

        {verify3 !== null && (
          <p className={`feedback ${verify3 ? "correct" : "incorrect"}`}>
            {verify3 ? "✅ Correct" : "❌ Incorrect"}
          </p>
        )}
      </div>

      {/* Navigation buttons */}
      {/* Error message */}
      {error && <p className="feedback incorrect">{error}</p>}
      <div className="navigation-container">
        <button onClick={handlePrevious} className="navigation-button">
          Previous
        </button>
        <button onClick={handleNext} className="navigation-button">
          Next
        </button>
      </div>


    </div>
  );
}

export default MultipleQuestions;
