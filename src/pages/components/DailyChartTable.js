import React, { useEffect, useState } from "react";
import {
  Table,
  Container,
  Row,
  Col,
  Modal,
  Button,
  Spinner,
  DropdownButton,
  Dropdown,
} from "react-bootstrap";
import moment from "moment";
import "./Users.css";
import BlockUi from "react-block-ui";
import "react-block-ui/style.css";
import { convertArrayToCSV } from "convert-array-to-csv";
import PendingModal from "./PendingModal";
const firebase = require("firebase");

export default function UserTable() {
  var [orders, setOrders] = useState([]);
  var [file, setFile] = useState(undefined);
  const [loading, setLoading] = useState(true);

  const northCity = ["panjim", "merces", "chimbel", "porvorim", "mapusa"];
  const southCity = ["margao", "kadamba", "vasco"];
  const [district, Setdistrict] = useState("North-Goa");
  const [city, setCity] = useState(northCity[0]);

  const [selected, setSelected] = useState(false);
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [blocking, setBlocking] = useState(false);
  const [downloading, setdownloading] = useState(false);

  const NorthEmail = "namit@palasha.in"; //"namit@palasha.in";
  const SouthEmail = "sarthak.mkt@yahoo.com"; //"sarthak.mkt@yahoo.com";

  const [email, setEmail] = useState(NorthEmail);
  const [approve, setApprove] = useState(false);

  useEffect(() => {
    getOrders();
    if (district === "North-Goa") {
      setEmail(NorthEmail);
    } else {
      setEmail(SouthEmail);
    }
  }, [district]);

  async function selectItem(con, order) {
    if (con) {
      setSelectedOrders([...selectedOrders, order]);
    } else {
      setSelectedOrders(selectedOrders.filter((x) => x !== order));
    }
    await setTimeout(100);
    // setShow(false);
    //console.log(selectedOrders);
  }

  async function DeleteOrders() {
    try {
      setBlocking(true);

      var selectedOrdersStrings = selectedOrders.map((x) => `${x.Mobile}`);
      //console.log(selectedOrdersStrings);
      var formdata = new URLSearchParams(); //FormData();
      formdata.append("data", selectedOrdersStrings);
      formdata.append("collection", "orders");

      var res = await fetch(
        // "http://localhost:5001/firstproject-3ca46/us-central1/deleteCollections",
        "https://us-central1-firstproject-3ca46.cloudfunctions.net/deleteCollections",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
          },
          body: formdata,
        }
      );

      setBlocking(false);
      setSelectedOrders([]);
      setSelected(false);
      getOrders();
    } catch (err) {
      console.log(err);
    }
  }

  function getOrders() {
    var temporders = [];

    setLoading(true);
    fetch(
      `https://us-central1-firstproject-3ca46.cloudfunctions.net/createCSV?district=${district}`
    )
      .then((res) => {
        return res.json();
      })
      .then((resJson) => {
        setOrders(resJson.Data);
        setLoading(false);
        console.log(resJson.Data);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  return (
    <Container fluid>
      <Row>
        <Col xs={9} style={{ display: "flex" }}>
          {/* <Button
            variant={selected ? "danger" : "light"}
            disabled={
              selected ? (selectedOrders.length < 1 ? true : false) : false
            }
            style={{
              marginLeft: "10px",
              marginBottom: "10px",
              marginTop: "10px",
              width: "min-content",
            }}
            onClick={() => {
              if (!selected) {
                setSelected(true);
              } else {
                DeleteOrders();
              }
            }}
          >
            {selected ? "Delete" : "Select"}
          </Button>
          <Button
            variant={"info"}
            style={{
              marginLeft: "10px",
              marginBottom: "10px",
              marginTop: "10px",
              width: "min-content",
              display: selected ? "block" : "none",
            }}
            onClick={() => {
              setSelected(false);
              setSelectedOrders([]);
            }}
          >
            Cancel
          </Button> */}
          <Button
            variant={"light"}
            style={{
              marginLeft: "10px",
              marginBottom: "10px",
              marginTop: "10px",
              width: "min-content",
            }}
            onClick={async () => {
              //
              setdownloading(true);
              var allOrders = [];
              for (var x in orders) {
                allOrders = [...allOrders, ...orders[x]];
              }
              var csvfile = convertArrayToCSV(allOrders);
              const url = window.URL.createObjectURL(new Blob([csvfile]));
              const link = document.createElement("a");
              link.href = url;
              link.setAttribute(
                "download",
                `${district}-${moment().format("DD-MM-YYYY")}.csv`
              );
              document.body.appendChild(link);
              setdownloading(false);
              link.click();
            }}
            disabled={downloading}
          >
            <div style={{ display: "flex" }}>
              <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
                style={{
                  display: downloading ? "block" : "none",
                  marginRight: "5px",
                }}
              />
              <h6>Download</h6>
            </div>
          </Button>
        </Col>
        <Col style={{ textAlign: "end" }}>
          <Button
            variant={"light"}
            style={{
              marginLeft: "10px",
              marginBottom: "10px",
              marginTop: "10px",
              width: "min-content",
            }}
            onClick={() => {
              const input = document.getElementById("uploadfile");
              input.click();
            }}
          >
            Upload
          </Button>
          <input
            style={{ display: "none" }}
            id="uploadfile"
            type="file"
            onChange={async (event) => {
              var tempfile = Array.from(event.target.files)[0];
              var text = await tempfile.text();
              setFile(text);
            }}
          ></input>
          <Button
            variant={"light"}
            disabled={!file}
            style={{
              marginLeft: "10px",
              marginBottom: "10px",
              marginTop: "10px",
              width: "min-content",
            }}
            onClick={() => {
              setApprove(true);
            }}
          >
            Email
          </Button>
        </Col>
      </Row>
      <Row>
        <Col xs={9}>
          {district === "North-Goa" ? (
            <div>
              {northCity.map((cty, index) => {
                return (
                  <Button
                    variant={city === cty ? "dark" : "light"}
                    style={{ margin: "5px" }}
                    onClick={() => {
                      setCity(cty);
                    }}
                  >
                    {cty}
                  </Button>
                );
              })}
            </div>
          ) : (
            <div>
              {southCity.map((cty, index) => {
                return (
                  <Button
                    variant={city === cty ? "dark" : "light"}
                    style={{ margin: "5px" }}
                    onClick={() => {
                      setCity(cty);
                    }}
                  >
                    {cty}
                  </Button>
                );
              })}
            </div>
          )}
        </Col>
        <Col>
          <DropdownButton
            id="dropdown-sort"
            title={`district: ${district}`}
            variant="light"
            style={{
              marginLeft: "auto",
              marginBottom: "10px",
              marginTop: "10px",
              width: "max-content",
            }}
          >
            <Dropdown.Item
              onClick={() => {
                Setdistrict("North-Goa");
                setCity(northCity[0]);
              }}
            >
              North-Goa
            </Dropdown.Item>
            <Dropdown.Item
              onClick={() => {
                Setdistrict("South-Goa");
                setCity(southCity[0]);
              }}
            >
              South-Goa
            </Dropdown.Item>
          </DropdownButton>
        </Col>
      </Row>
      {/* {currentorder ? (
        <PendingModal
          show={show && !showpaid}
          order={currentorder}
          setShow={setShow}
          getOrders={getOrders}
          setCurrentorder={setCurrentorder}
        />
      ) : (
        ""
      )} */}
      <Modal
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        show={approve}
        onHide={setApprove.bind(this, false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Send Email
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <input
            type="text"
            onChange={(event) => {
              setEmail(event.target.value);
            }}
            value={email}
          />
          <Button
            style={{
              marginLeft: "auto",
              marginBottom: "10px",
              marginTop: "10px",
              width: "max-content",
            }}
            onClick={async () => {
              console.log(email);
              try {
                var formdata = new URLSearchParams();
                formdata.append("file", file);
                formdata.append(
                  "name",
                  `${district}-${moment().format("DD-MM-YYYY")}.csv`
                );
                formdata.append("to", email);
                await fetch(
                  // "http://localhost:5001/firstproject-3ca46/us-central1/sendMail",
                  `https://us-central1-firstproject-3ca46.cloudfunctions.net/sendMail `,
                  {
                    method: "POST",
                    headers: {
                      "Content-Type":
                        "application/x-www-form-urlencoded;charset=UTF-8",
                    },
                    body: formdata,
                  }
                );
              } catch (err) {
                console.log(err);
              }
              setApprove(false);
              setFile(undefined);
            }}
          >
            Send
          </Button>
          <Button
            style={{
              marginLeft: "10px",
              marginBottom: "10px",
              marginTop: "10px",
              width: "max-content",
            }}
            onClick={setApprove.bind(this, false)}
          >
            Close
          </Button>
        </Modal.Body>
      </Modal>
      <Row>
        <Col>
          <BlockUi
            tag="div"
            blocking={blocking}
            message="Deleting, please wait"
          >
            <Table striped hover size="sm">
              <thead>
                <tr>
                  {selected ? <th>#</th> : ""}
                  <th>No.</th>
                  <th>Name</th>
                  <th>Contact No.</th>
                  <th className="tablecontent">Address</th>
                  <th className="tablecontent">City</th>
                  <th className="tablecontent">Frequency</th>
                  <th className="tablecontent">Qty.</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <Spinner
                    animation="border"
                    style={{ marginRight: "auto", marginLeft: "auto" }}
                  />
                ) : (
                  orders[city]?.map((order, index) => {
                    return (
                      <tr
                        onClick={() => {
                          // setCurrentorder(order);
                          // setShow(true);
                        }}
                      >
                        {selected ? (
                          <input
                            type="checkbox"
                            style={{ marginTop: "10px" }}
                            onClick={(e) => {
                              selectItem(e.target.checked, order);
                            }}
                          />
                        ) : (
                          ""
                        )}
                        <td>{index + 1}</td>
                        <td>{order.Name}</td>
                        <td className="tablecontent">{order.Mobile}</td>
                        <td className="tablecontent">{order.Address}</td>
                        <td className="tablecontent">{order.City}</td>
                        <td className="tablecontent">{order.Frequency}</td>
                        <td className="tablecontent">{order.Litres}</td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </Table>
          </BlockUi>
        </Col>
      </Row>
    </Container>
  );
}
