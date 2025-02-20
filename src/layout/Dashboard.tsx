import React from "react";
import LeftPane from "./LeftPane";

const Dashboard: React.FC = () => {
  return (
    <div className="dashboard-container">
      <div className="left-section">
        <LeftPane />
      </div>
      <div className="right-section">
        <h2>Right Section</h2>
      </div>
    </div>
  );
};

export default Dashboard;
