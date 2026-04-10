import { Link } from "react-router";
const Home = () => {
  return (
    <div className="flex flex-col gap-10">
      <h1
        className="text-4xl font-semibold"
        style={{ textAlign: "center", marginTop: "3rem" }}
      >
        Welcome to Moodfiy App!
      </h1>
      <div
        style={{
          marginTop: "1rem",
          textAlign: "center",
        }}
      >
        <Link
          style={{
            display: "inline-block",
            marginRight: "1rem",
            textDecoration: "none",
            color: "#fff",
            border: "1px solid green",
            padding: "0.5rem 1.5rem",
            borderRadius: "5px",
          }}
          to={"/register"}
        >
          Register
        </Link>
        <Link
          style={{
            display: "inline-block",
            textDecoration: "none",
            color: "#fff",
            border: "1px solid blue",
            padding: "0.5rem 1.5rem",
            borderRadius: "5px",
          }}
          to={"/login"}
        >
          Login
        </Link>
      </div>
    </div>
  );
};

export default Home;
