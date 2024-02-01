import React from "react";
import styled from "styled-components";

const FilterButtonContainer = styled.div`
  margin: 5px;
`;

const FilterLabel = styled.label`
  margin-right: 10px;
`;

const FilterSelect = styled.select`
  padding: 5px;
  border-radius: 4px;
  border: 1px solid #ccc;
`;

const FilterButton = ({ label, options, onChange }) => {
  return (
    <FilterButtonContainer>
      <FilterLabel>{label}:</FilterLabel>
      <FilterSelect onChange={(e) => onChange(e.target.value)}>
        <option value="">Any</option>
        {options.map((option, index) => (
          <option key={index} value={option}>
            {option}
          </option>
        ))}
      </FilterSelect>
    </FilterButtonContainer>
  );
};

export default FilterButton;
