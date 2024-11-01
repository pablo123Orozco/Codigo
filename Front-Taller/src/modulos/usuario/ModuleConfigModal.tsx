// ModuleConfigModal.tsx
import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

const modules = [
  { id: 'usuarios', name: 'Usuarios' },
  { id: 'clientes', name: 'Clientes' },
  { id: 'proveedores', name: 'Proveedores' },
  { id: 'vehiculos', name: 'Vehículos' },
  { id: 'ordenes', name: 'Órdenes de Servicio' },
  { id: 'servicios', name: 'Servicios' },
  { id: 'compras', name: 'Compras' },
  { id: 'caja', name: 'Caja' },
  { id: 'reportes', name: 'Reportes' },
];

interface ModuleConfigModalProps {
  onClose: () => void;
  onSave: () => void;
}

const ModuleConfigModal: React.FC<ModuleConfigModalProps> = ({ onClose, onSave }) => {
  const [modulePermissions, setModulePermissions] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    const storedPermissions = JSON.parse(localStorage.getItem('rolePermissions') || '{}');
    setModulePermissions(storedPermissions.usuario || {});
  }, []);

  const togglePermission = (moduleId: string) => {
    setModulePermissions((prevPermissions) => ({
      ...prevPermissions,
      [moduleId]: !prevPermissions[moduleId],
    }));
  };

  const handleSave = () => {
    const rolePermissions = {
      usuario: modulePermissions, // Guardamos los permisos del usuario común
      admin: modules.reduce((acc, mod) => ({ ...acc, [mod.id]: true }), {}), // Admin con acceso a todos
    };
    localStorage.setItem('rolePermissions', JSON.stringify(rolePermissions));
    onSave();
  };

  return (
    <Modal show onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Configuración de Módulos</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          {modules.map((module) => (
            <Form.Check 
              key={module.id}
              type="checkbox"
              label={module.name}
              checked={modulePermissions[module.id] || false}
              onChange={() => togglePermission(module.id)}
            />
          ))}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>Cerrar</Button>
        <Button variant="primary" onClick={handleSave}>Guardar</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModuleConfigModal;
