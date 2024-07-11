import React, { useState, useEffect } from 'react';
import { Button, Modal, Form } from 'react-bootstrap';
import axios from 'axios';

function Home() {
    const [show, setShow] = useState(false);
    const [personnes, setPersonnes] = useState([]);
    const [formData, setFormData] = useState({
        personne_id: '',
        name: '',
        classe: ''
    });
    const [isEditing, setIsEditing] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchPersonnes();
    }, []);
    
    const fetchPersonnes = async () => {
        try {
            const response = await axios.get('http://localhost:4000/products');
            if (response.data && Array.isArray(response.data)) {
                setPersonnes(response.data);
            } else {
                setPersonnes([]);
            }
        } catch (error) {
            console.error('Error fetching personnes:', error);
        }
    };
    
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleAddPersonnel = () => {
        setIsEditing(false);
        setFormData({
            personne_id: '',
            name: '',
            classe: ''
        });
        setShow(true);
    };

    const handleClose = () => {
        setShow(false);
        setFormData({
            personne_id: '',
            name: '',
            classe: ''
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Submitting form data:', formData);
        try {
            if (isEditing) {
                await axios.put(`http://localhost:4000/products/${formData.personne_id}`, {
                    name: formData.name,
                    classe: formData.classe
                });
                console.log("aaa");
            } else {
                await axios.post('http://localhost:4000/products', {
                    name: formData.name,
                    classe: formData.classe
                });
                console.log("bbb");
            }

            handleClose();
            fetchPersonnes();
        } catch (error) {
            console.error('Error saving produit:', error);
            alert('Error saving produit');
        }
    };

    const handleEdit = (produit) => {
        console.log('Editing produit:', produit);
        setIsEditing(true);
        setFormData({
            personne_id: produit.id,
            name: produit.name,
            classe: produit.classe
        });
        setShow(true);
    };

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this produit?');
        if (!confirmDelete) return;
    
        try {
            await axios.delete(`http://localhost:4000/products/${id}`);
            const updatedPersonnels = personnes.filter(personnes => personnes.id !== id);
            setPersonnes(updatedPersonnels); // Update personnels state after successful deletion
            alert('Product deleted successfully');
        } catch (error) {
            console.error('Error deleting produit:', error);
            alert('Error deleting produit');
        }
    };

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const filteredPersonnes = personnes.filter(produit =>
        produit.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="container">
            <div className="crud shadow-lg p-3 mb-5 mt-5 bg-body rounded">
                <div className="row">
                    <div className="col-sm-3 mt-5 mb-4 text-gred">
                        <div className="search">
                            <form className="form-inline">
                                <input
                                    className="form-control mr-sm-2"
                                    type="search"
                                    placeholder="Search produits"
                                    aria-label="Search"
                                    value={searchTerm}
                                    onChange={handleSearchChange}
                                />
                            </form>
                        </div>
                    </div>
                    <div className="col-sm-3 offset-sm-2 mt-5 mb-4 text-gred" style={{ color: "green" }}>
                        <h2><b>Listes des produits</b></h2>
                    </div>
                    <div className="col-sm-3 offset-sm-1 mt-5 mb-4 text-gred">
                        <Button variant="primary" onClick={handleAddPersonnel}>
                            Ajouter nouveau produits
                        </Button>
                    </div>
                </div>
                <div className="row">
                    <div className="table-responsive">
                        <table className="table table-striped table-hover table-bordered">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Nom</th>
                                    <th>Frequence</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredPersonnes.map((produit, index) => (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{produit.name}</td>
                                        <td>{produit.classe}</td>
                                        <td>
                                            <a href="#" className="edit" title="Edit" data-toggle="tooltip" onClick={() => handleEdit(produit)}>
                                                <i className="material-icons">&#xE254;</i>
                                            </a>
                                            <a href="#" className="delete" title="Delete" data-toggle="tooltip" onClick={() => handleDelete(produit.id)}>
                                                <i className="material-icons">&#xE872;</i>
                                            </a>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="model_box">
                    <Modal show={show} onHide={handleClose} backdrop="static" keyboard={false}>
                        <Modal.Header closeButton>
                            <Modal.Title>{isEditing ? "Edit Record" : "Add Record"}</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Form onSubmit={handleSubmit}>
                                <Form.Group controlId="formName">
                                    <Form.Label>Nom du produit</Form.Label>
                                    <Form.Control type="text" placeholder="Enter nom produit" name="name" value={formData.name} onChange={handleChange} />
                                </Form.Group>
                                <Form.Group controlId="formClasse">
                                    <Form.Label>Frequence</Form.Label>
                                    <Form.Control type="text" placeholder="Enter classe du produit" name="classe" value={formData.classe} onChange={handleChange} />
                                </Form.Group>
                                <br />
                                <Button variant="primary" type="submit">
                                    {isEditing ? "Update Record" : "Add Record"}
                                </Button>
                            </Form>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={handleClose}>
                                Close
                            </Button>
                        </Modal.Footer>
                    </Modal>
                </div>
            </div>
        </div>
    );
}

export default Home;
