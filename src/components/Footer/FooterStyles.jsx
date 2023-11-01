import styled from "styled-components";

export const Box = styled.div`
  padding: 5px;
  background: rgb(12, 13, 14);
  margin-top: auto;
  width: 100%;
  @media (max-width: 1000px) {
    padding: 70px 30px;
  }
`;

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  max-width: 1000px;
  margin: 0 auto;

  img {
    border-radius: 5px;
    transition: 0.3s;
    &:hover {
      box-shadow: 0 0 20px rgba(150, 150, 150, 1);
    }
  }
`;

export const Column = styled.div`
  display: flex;
  flex-direction: column;
  text-align: left;
  margin-top: 10px;
  margin-left: 120px;
`;

export const Row = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(185px, 1fr));
  grid-gap: 10px;
  @media (max-width: 1000px) {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  }
`;

export const FooterLink = styled.a`
  color: #fff;
  margin-bottom: 20px;
  font-size: 12px;
  text-decoration: none;
  transition: color 100ms ease-in;

  &:hover {
    color: #303436;
  }
`;

export const Heading = styled.p`
  color: #ccc;
  width: 130px;
  font-size: 24px;
  font-family: "Poppins", sans-serif;
  font-weight: bold;
  letter-spacing: 6px;
  text-align: center;
  margin: 10px 0 20px;
`;

export const SectionHeading = styled.p`
  color: #fff;
  font-size: 18px;
  font-weight: bold;
  margin: 10px 0;
`;

export const Copyright = styled.div`
  p {
    color: #ccc;
    font-size: 14px;
    text-align: center;
    margin-top: 20px;
  }
`;
