import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { getLocations, isNameValid } from './mock-api/apis';


const MyForm = () => {
    const [name, setName] = useState('');
    const [locationOptions, setLocationOptions] = useState([]);
    const [isNameTaken, setIsNameTaken] = useState(false);
    const [submittedData, setSubmittedData] = useState([]);
    const [isValidating, setIsValidating] = useState(false);
    const [isNameAvailable, setIsNameAvailable] = useState(true);
    const [selectedOption, setSelectedOption] = useState('Canada');

    // Fetch location options from mock API

    useEffect(() => {

        getLocations().then(data => {
            setLocationOptions(data);
        })

        // Ignore validation if the name is empty
        if (name === '') {
            setIsNameAvailable(true);
            setIsValidating(false);
            return;
        }

        // Start validating name
        setIsValidating(true);

        let nameExists = checkIfNameExists();
        let value = nameExists ? "invalid name" : "valid name"

        isNameValid(value)
            .then((isValid) => {
                setIsNameAvailable(isValid);
            })
            .finally(() => {
                setIsValidating(false);
            });
    }, [name]);

    const handleOptionChange = (event) => {
        console.log(event.target.value);
        setSelectedOption(event.target.value);
    };



    // Function to handle name input change
    const handleNameChange = (event) => {
        const newName = event.target.value;
        setName(newName);

        isNameValid().then(data => {
            setIsNameTaken(true);
        })
    };

    // Function to handle form submission
    const handleSubmit = (event) => {
        event.preventDefault();
        console.log(locationOptions[0]);
        if (!isNameTaken) {
            const newData = {
                name: name,
                location: selectedOption
            };
            setSubmittedData([...submittedData, newData]);
            console.log(newData);
            handleClear();
        }
    };

    const handleChange = (event) => {
        const newName = event.target.value;
        console.log(newName);

        setName(newName);
    };

    // Function to handle clearing input fields
    const handleClear = () => {
        setName('');
        setIsNameTaken(false);
    };

    const checkIfNameExists = () => {
        if (submittedData.length > 0) {
            console.log("submitted data " + submittedData.map(data => data.name));
            console.log("input name " + name);
            const result = submittedData.some(item => item.name == name);
            console.log("result " + result);

            return result;
        }
    };

    return (
        <FormContainer>
            <form onSubmit={handleSubmit}>
                <InputContainer>
                    <InputLabel>Name:</InputLabel>
                    <NameInput
                        type="text"
                        value={name}
                        onChange={handleChange}
                        placeholder="Enter your name"
                    />

                    {!isValidating && !isNameAvailable && (
                        <p style={{ color: 'red', textAlign: 'left', margin: "0px" }}>this name has already been taken</p>
                    )}
                </InputContainer>
                <InputContainer>
                    <InputLabel>Location:</InputLabel>
                    <LocationSelect value={selectedOption} onChange={handleOptionChange}>
                        {locationOptions.map(option => (
                            <option key={option} value={option}>{option}</option>
                        ))}
                    </LocationSelect>
                </InputContainer>
                <ButtonContainer>
                    <ClearButton type="button" onClick={handleClear}>Clear</ClearButton>
                    <SubmitButton type="submit" disabled={!isNameAvailable}>Submit</SubmitButton>
                </ButtonContainer>
            </form>

            <SubmittedData>
                <DataTable>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Location</th>
                        </tr>
                    </thead>
                    <tbody>
                        {submittedData.map((data, index) => (
                            <tr key={index}>
                                <td>{data.name}</td>
                                <td>{data.location}</td>
                            </tr>
                        ))}
                    </tbody>
                </DataTable>
            </SubmittedData>
        </FormContainer>
    );
};

// Styled components
const FormContainer = styled.div`
  max-width: 500px;
  margin: 50px auto;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 10px;
`;

const InputContainer = styled.div`
  margin-bottom: 20px;
`;

const InputLabel = styled.label`
  display: block;
  margin-bottom: 5px;
  text-align:left;
`;

const NameInput = styled.input`
  width: 95%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
`;

const LocationSelect = styled.select`
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
`;

const ErrorMessage = styled.p`
  color: red;
  margin-top: 5px;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
`;

const SubmitButton = styled.button`
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
`;

const ClearButton = styled.button`
  padding: 10px 20px;
  background-color: #dc3545;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
`;

const SubmittedData = styled.div`
  margin-top: 20px;
`;

const DataTable = styled.table`
  width: 100%;
  border-collapse: collapse;

  th, td {
    padding: 10px;
    border-bottom: 1px solid #ddd;
  }

  th {
    background-color: #f2f2f2;
    text-align: left;
  }

  td {
    text-align: left;
  }

  tr:nth-child(even) {
    background-color: #f2f2f2;
  }
`;

export default MyForm;
