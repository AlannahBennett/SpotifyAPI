import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  Container,
  InputGroup,
  FormControl,
  Button,
  Row,
  Card,
  Form,
  CardBody,
  CardTitle,
  Navbar,
  Nav,
  Col,
} from "react-bootstrap";
import { useState, useEffect } from "react";

const CLIENT_ID = "ccefd73f4257477ab905d4da6556ae88";
const CLIENT_SECRET = "6ac6831663db4246811532d8f79c866c";

function App() {
  const [searchInput, setSearchInput] = useState("");

  const [accessToken, setAccessToken] = useState("");

  const [albums, setAlbums] = useState([]);

  //Once at the start
  useEffect(() => {
    //API Acess Token -> request
    var authParameters = {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body:
        "grant_type=client_credentials&client_id=" +
        CLIENT_ID +
        "&client_secret=" +
        CLIENT_SECRET,
    };
    fetch("https://accounts.spotify.com/api/token", authParameters)
      .then((result) => result.json())
      .then((data) => setAccessToken(data.access_token));
  }, []);

  //Search Func

  async function search() {
    console.log("Searching for " + searchInput);

    //Artist ID ( get request using search to get id)
    var searchParams = {
      method: "GET",
      headers: {
        "Content-Type": "application.json",
        Authorization: "Bearer " + accessToken,
      },
    };
    var artistID = await fetch(
      "https://api.spotify.com/v1/search?q=" + searchInput + "&type=artist",
      searchParams
    )
      .then((response) => response.json())
      .then((data) => {
        return data.artists.items[0].id;
      });

    console.log("Artist ID is " + artistID);

    //get request WITH artist if and get albums from that artist

    var returnedAlbums = await fetch(
      "https://api.spotify.com/v1/artists/" +
        artistID +
        "/albums" +
        "?include_groups=album&market=US&limit=50",
      searchParams
    )
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setAlbums(data.items);
      });

    //display albums

    console.log(albums);
  }

  return (
    <div className="App">

      <Navbar expand="lg" className="bg-body-tertiary">
        <Container>
          <Navbar.Brand href="#home">Spotify Clone</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link href="#home">Home</Nav.Link>
              <Nav.Link href="#link">Link</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Row className="my-3">
        <Col sm={4} className="">
          <Container>
            <h1>This will be a side bar</h1>
          </Container>
        </Col>

        <Col sm={8}>
          <Container>
            <InputGroup className="mb-3" size="lg">
              <FormControl
                placeholder="Search For Artist"
                type="input"
                onKeyPress={(event) => {
                  if (event.key == "Enter") {
                    search();
                  }
                }}
                onChange={(event) => setSearchInput(event.target.value)}
              />

              <Button onClick={search}>Search</Button>
            </InputGroup>

            <Container>
              <Row className="mx-2 row row-cols-3">
                {albums.map((album, i) => {
                  return (
                    <Card className="mb-3">
                      <Card.Img src={album.images[0].url} />
                      <CardBody>
                        <CardTitle>{album.name}</CardTitle>
                      </CardBody>
                    </Card>
                  );
                })}
              </Row>
            </Container>
          </Container>
        </Col>
      </Row>

    </div>
  );
}

export default App;
