import React, { useState } from "react";
import Layout from "../../components/Layout";
import { Container, Form, Row, Col, Button } from "react-bootstrap";
import Input from "../../components/UI/Input";
import { Redirect } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { _SEND_OTP, _VERIFY_OTP } from "../../actions";
import { useEffect } from "react";

/**
 * @author
 * @function Signup
 **/

const Signup = (props) => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [code, setCode] = useState("");
  const auth = useSelector((state) => state.auth);
  const user = useSelector((state) => state.user);
  const [buttonDisabled, setButtonDisabled] = useState(true)
  const [timerTime, setTimerTime] = useState(60)
  const dispatch = useDispatch();

  // useEffect(() => {
  //   if (!user.loading) {
  //     setEmail("");
  //     setPassword("");
  //     setName('');
  //   }
  // }, [user.loading]);

  let registerTimeout;
  useEffect(() => {
    if (user.sentOTP) {
      setButtonDisabled(true)
      registerTimeout = setTimeout(() => {
        setButtonDisabled(false)
        user.sentOTP = false;
      }, 60000);
    }
  }, [user.sentOTP])

  const timer = () => {
    let timeOut;
    if (user.sentOTP) {
      if (timerTime > 0) {
        // Timer started 
        timeOut = setTimeout(() => {
          setTimerTime(timerTime - 1)
        }, 1000);
      } else {
        // TImer ended 
        clearTimeout(timeOut);
        clearTimeout(registerTimeout);
        setTimerTime(60);
        return null;
      }
    }
    return (<>Resend in {timerTime}s</>)
  }


  const getOTP = (e) => {
    e.preventDefault();

    const data = {
      name,
      phone,
      email,
      password
    }

    dispatch(_SEND_OTP(data))
  }
  const verifyOTP = (e) => {
    e.preventDefault()

    dispatch(_VERIFY_OTP({ phone, code }));
  }

  if (auth.authenticate) {
    return <Redirect to={`/`} />;
  }

  if (user.loading) {
    return <p>Loading...!</p>;
  }

  return (
    <Layout>
      <Container>
        {user.message}
        <Row style={{ marginTop: "50px" }}>
          <Col md={{ span: 6, offset: 3 }}>
            <Form>

              <Input
                label="Full Name"
                placeholder=""
                value={name}
                type="text"
                onChange={(e) => setName(e.target.value)}
              />

              <Input
                label="Mobile Number"
                placeholder=""
                value={phone}
                type="number"
                onChange={(e) => {
                  setPhone(e.target.value)
                  if (e.target.value.length !== 12) {
                    setButtonDisabled(true)
                  } else {
                    setButtonDisabled(false)
                  }
                }}
              />
              <Input
                label="Email"
                placeholder="Email"
                value={email}
                type="email"
                onChange={(e) => setEmail(e.target.value)}
              />

              <Input
                label="Password"
                placeholder="Password"
                value={password}
                type="password"
                onChange={(e) => setPassword(e.target.value)}
              />
              <Button variant="primary" type="submit" onClick={getOTP} disabled={buttonDisabled}>
                Get OTP
              </Button>
              {user.sentOTP ? timer() : null}
              <Container fluid style={{ display: "flex", flexDirection: "column", }}>
                {
                  user.sentOTP
                    ?
                    (
                      <> Enter your otp here
                        <input value={code} onChange={(e) => setCode(e.target.value)} />
                        <button onClick={(e) => verifyOTP(e)}>Verify </button></>
                    )
                    :
                    null
                }
              </Container>
            </Form>
          </Col>
        </Row>
      </Container>
    </Layout>
  );
};

export default Signup;
