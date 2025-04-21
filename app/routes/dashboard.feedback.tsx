import { Form } from "@remix-run/react";
import { useState } from "react";

const Feedback: React.FC = () => {
  const [success, setSuccess] = useState<boolean>(false);

  function Submit() {
    setSuccess(true);
    const formElement = document.querySelector("form");
    const formData = new FormData(formElement!);
    fetch(
      "https://script.google.com/macros/s/AKfycbx8FxL-gWDQs5hpjGzZ9SNectsNLwFLOk91LT3OrLDn0-kKsB9GXRo1n2NXVzES2bV7/exec",
      {
        method: "POST",
        body: formData,
      }
    );
  }

  return (
    <div className="container mt-5 d-flex justify-content-center align-items-center">
      <Form className="form" onSubmit={(e) => Submit()}>
        <h1 className="mb-4" style={{ fontSize: "1.5rem" }}>
          Please feel free to post your feedback or queries regarding the tool
        </h1>
        <div className="input-group mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Your comment or query"
            name="feedback"
            style={{ fontSize: "0.9rem" }}
          />
          <button type="submit" className="btn btn-primary">
            Submit
          </button>
        </div>
        {success && (
          <div className="alert alert-success" role="alert">
            Form submitted gracefully!
          </div>
        )}
      </Form>
    </div>
  );
};

export default Feedback;
