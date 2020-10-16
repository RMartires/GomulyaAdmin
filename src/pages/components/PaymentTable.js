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
import PaymentModal from "./PaymentModal";
const firebase = require("firebase");

export default function UserTable() {
  var [orders, setOrders] = useState([]);
  var [currentorder, setCurrentorder] = useState(undefined);
  const [show, setShow] = useState(false);
  const [showpaid, setShowpaid] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sortby, Setsortby] = useState("asc");
  const [downloading, setdownloading] = useState(false);

  const [selected, setSelected] = useState(false);
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [blocking, setBlocking] = useState(false);

  useEffect(() => {
    getOrders();
  }, [sortby]);

  async function selectItem(con, order) {
    if (con) {
      setSelectedOrders([...selectedOrders, order]);
    } else {
      setSelectedOrders(selectedOrders.filter((x) => x !== order));
    }
    await setTimeout(100);
    setShow(false);
    //console.log(selectedOrders);
  }

  async function DeleteOrders() {
    try {
      setBlocking(true);

      var selectedOrdersStrings = selectedOrders.map((x) => `${x.phoneNumber}`);
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
    firebase
      .firestore()
      .collection("orders")
      .orderBy("updatedAt", sortby)
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          temporders.push(doc.data());
        });
        setOrders(temporders);
        setLoading(false);
        console.log(temporders);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  return (
    <Container fluid>
      <Row>
        <Col style={{ display: "flex" }}>
          <Button
            variant={selected ? "danger" : "dark"}
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
          </Button>
          <Button
            variant={"dark"}
            style={{
              marginLeft: "10px",
              marginBottom: "10px",
              marginTop: "10px",
              width: "min-content",
            }}
            onClick={async () => {
              //
              setdownloading(true);
              var res = await fetch(
                "https://us-central1-firstproject-3ca46.cloudfunctions.net/createPaymentCSV"
                // "http://localhost:5001/firstproject-3ca46/us-central1/getUserCSV"
              );
              var resjson = await res.json();
              const url = window.URL.createObjectURL(new Blob([resjson.file]));
              const link = document.createElement("a");
              link.href = url;
              link.setAttribute(
                "download",
                `Payment_${moment().format("DD-MM-YYYY")}.csv`
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
                variant="light"
                aria-hidden="true"
                style={{
                  display: downloading ? "block" : "none",
                  marginRight: "5px",
                  color: "white",
                }}
              />
              <h6>Download</h6>
            </div>
          </Button>
        </Col>
        <Col>
          <DropdownButton
            id="dropdown-sort"
            title={`sort by modified: ${sortby}`}
            variant="dark"
            style={{
              marginLeft: "auto",
              marginBottom: "10px",
              marginTop: "10px",
              width: "max-content",
            }}
          >
            <Dropdown.Item onClick={Setsortby.bind(this, "asc")}>
              Asc
            </Dropdown.Item>
            <Dropdown.Item onClick={Setsortby.bind(this, "desc")}>
              Desc
            </Dropdown.Item>
          </DropdownButton>
        </Col>
      </Row>
      {currentorder ? (
        <PaymentModal
          show={show && !showpaid}
          order={currentorder}
          setShow={setShow}
          getOrders={getOrders}
          setCurrentorder={setCurrentorder}
        />
      ) : (
        ""
      )}
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
                  <th>
                    Payment
                    <br />
                    status
                  </th>
                  <th className="tablecontent">Total</th>
                  <th className="tablecontent">
                    Paid
                    <br />
                    Amount
                  </th>
                  <th className="tablecontent">
                    Remaining
                    <br />
                    Amount
                  </th>
                  <th className="tablecontent">
                    Payment
                    <br />
                    Method
                  </th>
                  <th className="tablecontent">Qty.</th>
                  <th className="tablecontent">Frequency</th>
                  <th className="tablecontent">
                    Contact
                    <br />
                    No.
                  </th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <Spinner
                    animation="border"
                    variant="light"
                    style={{ marginRight: "auto", marginLeft: "auto" }}
                  />
                ) : (
                  orders.map((order, index) => {
                    return (
                      <tr
                        onClick={() => {
                          setCurrentorder(order);
                          setShow(true);
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
                        <td>{order.name}</td>
                        <td className="tablecontent">{order?.paymentStatus}</td>
                        <td className="tablecontent">{order?.price}</td>
                        <td className="tablecontent">{order?.paidAmount}</td>
                        <td className="tablecontent">
                          {order?.remainingAmount}
                        </td>
                        <td className="tablecontent">{order?.paymentMethod}</td>
                        <td className="tablecontent">{order?.quantity}</td>
                        <td className="tablecontent">{order.frequency}</td>
                        <td className="tablecontent">{order.phoneNumber}</td>
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
