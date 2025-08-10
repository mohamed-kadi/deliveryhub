const Button = ({ text, onClick, type = "submit" }) => {
    return (
      <button className="btn" onClick={onClick} type={type}>
        {text}
      </button>
    );
  };
  
  export default Button;
  