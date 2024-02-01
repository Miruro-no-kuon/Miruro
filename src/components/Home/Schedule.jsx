// Schedule.jsx
import React from "react";
import styled from "styled-components";

const ScheduleContainer = styled.div`
  /* Add styles for your schedule container */
`;

const ScheduleItem = styled.div`
  /* Add styles for individual schedule items */
`;

const Schedule = ({ data }) => {
  return (
    <ScheduleContainer>
      {data.map((item, index) => (
        <ScheduleItem key={index}>
          <p>
            {item.title} - {item.time}
          </p>
        </ScheduleItem>
      ))}
    </ScheduleContainer>
  );
};

export default Schedule;
