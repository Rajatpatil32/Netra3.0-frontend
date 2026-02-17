import ArrowBackIcon from "@mui/icons-material/ArrowBack";

export default function BackButton({ onClick }) {
  return (
    <button className="back-btn" onClick={onClick}>
      <ArrowBackIcon />
    </button>
  );
}
