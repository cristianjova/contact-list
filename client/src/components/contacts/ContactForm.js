import React, { useState, useContext, useEffect } from 'react';
import ContactContext from '../../context/contact/contactContext';

const ContactForm = () => {
  const contactContext = useContext(ContactContext);

  const {
    addContact,
    clearCurrent,
    currentContact,
    updateContact
  } = contactContext;

  useEffect(() => {
    if (currentContact !== null) {
      setContact(currentContact);
    } else {
      setContact({
        name: '',
        email: '',
        phone: '',
        type: 'personal'
      });
    }
  }, [contactContext, currentContact]);

  // Component level state
  const [contact, setContact] = useState({
    name: '',
    email: '',
    phone: '',
    type: 'personal'
  });

  const { name, email, phone, type } = contact;

  const onChange = e =>
    setContact({ ...contact, [e.target.name]: e.target.value });

  const onSubmit = e => {
    e.preventDefault();
    if (currentContact === null) {
      addContact(contact);
    } else {
      updateContact(contact);
    }
    clearAll();
  };

  const clearAll = () => {
    clearCurrent();
  };

  return (
    <form onSubmit={onSubmit}>
      <h2 className='text-primary'>
        {currentContact ? 'Editar Contacto' : 'Agregar Contacto'}
      </h2>
      <input
        type='text'
        name='name'
        placeholder='Nombre'
        value={name}
        onChange={onChange}
      />
      <input
        type='email'
        name='email'
        placeholder='Email'
        value={email}
        onChange={onChange}
      />
      <input
        type='text'
        name='phone'
        placeholder='Telefono'
        value={phone}
        onChange={onChange}
      />
      <h5>Tipo de Contacto</h5>
      <input
        type='radio'
        name='type'
        value='personal'
        checked={type === 'personal'}
        onChange={onChange}
      />
      Personal{' '}
      <input
        type='radio'
        name='type'
        value='professional'
        checked={type === 'professional'}
        onChange={onChange}
      />
      Profesional{' '}
      <div>
        <input
          type='submit'
          value={currentContact ? 'Actualizar Contacto' : 'Agregar Contacto'}
          className='btn btn-primary btn-block'
        />
      </div>
      {currentContact && (
        <div>
          <button className='btn btn-light btn-block' onClick={clearAll}>
            Limpiar
          </button>
        </div>
      )}
    </form>
  );
};

export default ContactForm;
