import React, { useState, useEffect } from "react";
import Mainpanelnav from "../mainpanel-header/Mainpanelnav";
import { BsBookmarkPlus } from "react-icons/bs";
import { GrFormPrevious, GrFormNext } from "react-icons/gr";
import { BiSkipNext, BiSkipPrevious } from "react-icons/bi";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  useToast,
} from "@chakra-ui/react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  useDisclosure,
  Spinner,
} from "@chakra-ui/react";
import axios from "axios";
import { GpState } from "../../context/context";
import Delete from "../delete/Delete";
import { config, postConfig } from "../../services/Services";

function City() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [loading, setLoading] = useState(false);
  const [cities, setCities] = useState([]);
  const [updateTable, setUpdateTable] = useState(false);
  const [microlocationfield, setMicrolocationfield] = useState({
    name: "",
    country: "",
    state: "",
    description: "",
    city: "",
  });
  const [states, setStates] = useState([]);
  const [countryId, setCountryId] = useState(null);
  const [stateId, setStateId] = useState(null);
  const [cityId, setCityId] = useState(null);
  const [microlocations, setMicrolocations] = useState([]);
  const { country, setCountry } = GpState();

  const [selectItemNum, setSelectItemNum] = useState(10);
  const itemsPerPageHandler = (e) => {
    setSelectItemNum(e.target.value);
  };
  const [curPage, setCurPage] = useState(1);
  const recordsPerPage = selectItemNum;
  const lastIndex = curPage * recordsPerPage;
  const firstIndex = lastIndex - recordsPerPage;
  const records = microlocations?.slice(firstIndex, lastIndex);
  const nPage = Math.ceil(microlocations?.length / recordsPerPage);

  const toast = useToast();
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setMicrolocationfield({
      ...microlocationfield,
      [name]: value,
    });
  };

  const handleSaveMicrolocations = async () => {
    try {
      const { data } = await axios.post(
        "/api/microlocation/microlocations",
        {
          name: microlocationfield.name,
          description: microlocationfield.description,
          country: countryId,
          state: stateId,
          city: cityId,
        },
        postConfig
      );
      setMicrolocationfield({
        name: "",
        description: "",
        country: "",
        state: "",
        city: "",
      });
      setUpdateTable((prev) => !prev);
      onClose();
      toast({
        title: "Saved Successfully!",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the Search Results",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };
  const getCityByState = async () => {
    try {
      setLoading(true);
      await axios
        .post("/api/city/citybystate", { state_id: stateId }, postConfig)
        .then((result) => {
          console.log(result.data);
          setCities(result.data);
        });
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };
  const getStateByCountry = async () => {
    try {
      setLoading(true);
      await axios
        .post(
          "/api/state/statesbycountry",
          { country_id: countryId },
          postConfig
        )
        .then((result) => {
          console.log(result.data);
          setStates(result.data);
        });
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };
  const getCountry = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("/api/allCountry/countries", config);
      setLoading(false);
      setCountry(data.country);
    } catch (error) {
      console.log(error);
    }
  };
  const getMicroLocation = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        "/api/microlocation/microlocations",
        config
      );
      setLoading(false);
      setMicrolocations(data);
    } catch (error) {
      console.log(error);
    }
  };
  const handleDeleteMicrolocations = async (id) => {
    try {
      const { data } = await axios.delete(
        `/api/microlocation/delete/${id}`,
        config
      );
      setUpdateTable((prev) => !prev);
      toast({
        title: "Deleted Successfully!",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };
  useEffect(() => {
    getCountry();
    getMicroLocation();
  }, [updateTable]);
  const onChangeHandler = (e) => {
    const index = e.target.selectedIndex;
    const el = e.target.childNodes[index];
    const option = el.getAttribute("id");
    const { name, value } = e.target;
    setMicrolocationfield({
      ...microlocationfield,
      [name]: value,
    });
    setCountryId(option);
  };
  const onChangeHandlerState = (e) => {
    const index = e.target.selectedIndex;
    const el = e.target.childNodes[index];
    const option = el.getAttribute("id");
    const { name, value } = e.target;
    setMicrolocationfield({
      ...microlocationfield,
      [name]: value,
    });
    setStateId(option);
  };
  const onChangeHandlerCity = (e) => {
    const index = e.target.selectedIndex;
    const el = e.target.childNodes[index];
    const option = el.getAttribute("id");
    const { name, value } = e.target;
    setMicrolocationfield({
      ...microlocationfield,
      [name]: value,
    });
    setCityId(option);
  };

  if (firstIndex > 0) {
    var prePage = () => {
      if (curPage !== firstIndex) {
        setCurPage(curPage - 1);
      }
    };
  }

  if (records?.length === selectItemNum) {
    var nextPage = () => {
      if (curPage !== lastIndex) {
        setCurPage(curPage + 1);
      }
    };
  }

  const getFirstPage = () => {
    setCurPage(1);
  };

  const getLastPage = () => {
    setCurPage(nPage);
  };

  return (
    <>
      <div className="mx-5 mt-3">
        <Mainpanelnav />
        <div className="d-flex justify-content-end w-100">
          <Button className="addnew-btn" onClick={onOpen}>
            <BsBookmarkPlus />
            ADD NEW
          </Button>
        </div>
        <div>
          <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Add New Microlocation</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <div className="d-flex justify-content-between">
                  <div className="select-box">
                    <select
                      name="country"
                      value={microlocationfield.country}
                      onChange={onChangeHandler}
                      onClick={getStateByCountry}
                    >
                      <option>Select Country</option>
                      {country?.map((countryElem) => (
                        <option
                          id={countryElem._id}
                          key={countryElem._id}
                          value={countryElem.name}
                        >
                          {countryElem.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="select-box">
                    <select
                      name="state"
                      value={microlocationfield.state}
                      onChange={onChangeHandlerState}
                      onClick={getCityByState}
                    >
                      <option>Select State</option>
                      {states?.map((stateElem) => (
                        <option
                          id={stateElem._id}
                          key={stateElem._id}
                          value={stateElem.name}
                        >
                          {stateElem.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="select-box">
                    <select
                      name="city"
                      value={microlocationfield.city}
                      onChange={onChangeHandlerCity}
                    >
                      <option>Select City</option>
                      {cities?.map((cityElem) => (
                        <option
                          id={cityElem._id}
                          key={cityElem._id}
                          value={cityElem.name}
                        >
                          {cityElem.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <input
                  name="name"
                  value={microlocationfield.name}
                  onChange={handleInputChange}
                  type="text"
                  placeholder="Name"
                  className="property-input"
                />
                <input
                  name="description"
                  value={microlocationfield.description}
                  onChange={handleInputChange}
                  type="text"
                  placeholder="Description"
                  className="property-input"
                />
              </ModalBody>
              <ModalFooter>
                <Button colorScheme="blue" mr={3} onClick={onClose}>
                  Cancel
                </Button>
                <Button variant="ghost" onClick={handleSaveMicrolocations}>
                  Save
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </div>
        <div className="table-box">
          <div className="table-top-box">Microlocation Table</div>
          <TableContainer marginTop="60px" variant="striped" color="teal">
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>Name</Th>
                  <Th>Country</Th>
                  <Th>State</Th>
                  <Th>City</Th>
                  <Th>Delete</Th>
                </Tr>
              </Thead>
              <Tbody>
                {loading ? (
                  <Tr>
                    <Td>
                      <Spinner
                        size="xl"
                        w={20}
                        h={20}
                        alignSelf="center"
                        style={{ position: "absolute", left: "482px" }}
                      />
                    </Td>
                  </Tr>
                ) : (
                  records?.map((micro) => (
                    <Tr key={micro._id} id={micro._id}>
                      <Td>{micro.name}</Td>
                      <Td>{micro.country?.name}</Td>
                      <Td>{micro.state?.name}</Td>
                      <Td>{micro.city?.name}</Td>
                      <Td>
                        <Delete
                          handleFunction={() =>
                            handleDeleteMicrolocations(micro._id)
                          }
                        />
                      </Td>
                    </Tr>
                  ))
                )}
              </Tbody>
            </Table>
          </TableContainer>
          <nav className="mt-5">
            <div
              className="d-flex align-items-center justify-content-between"
              style={{ width: "51%" }}
            >
              <p className="mb-0">Items per page: </p>
              <div style={{ borderBottom: "1px solid gray" }}>
                <select
                  className="form-select"
                  aria-label="Default select example"
                  required
                  value={selectItemNum}
                  onChange={itemsPerPageHandler}
                  style={{ paddingLeft: "0" }}
                >
                  <option value="10">10</option>
                  <option value="25">25</option>
                  <option value="50">50</option>
                  <option value="100">100</option>
                </select>
              </div>
              <div style={{ width: "110px" }}>
                {firstIndex + 1} - {records?.length + firstIndex} of{" "}
                {microlocations?.length}
              </div>

              <div className="page-item">
                <BiSkipPrevious onClick={getFirstPage} />
              </div>
              <div className="page-item">
                <GrFormPrevious onClick={prePage} />
              </div>
              <div className="page-item">
                <GrFormNext onClick={nextPage} />
              </div>
              <div className="page-item">
                <BiSkipNext onClick={getLastPage} />
              </div>
            </div>
          </nav>
        </div>
      </div>
    </>
  );
}

export default City;
