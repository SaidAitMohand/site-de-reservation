import {useEffect, useState} from 'react';
import './apiAdmin.css'

function ApiAdmin() {
    const [users, setUsers] = useState([]);
    useEffect(() => {
        fetch('http://localhost:3000/users')
        .then(res => {
            if(!res.ok){
                throw new Error('Erreur lors de la récupération des utilisateurs');
            }
            return res.json();
        })
        .then(data => {
            setUsers(data);
        })
    }, []);
    //fonction qui change l'etat de l'utilisateur
    const switchEtat = (user) => {
        const newStatus = (user.status === 1)? 0 : 1 

        fetch(`http://localhost:3000/users/${user.id}/status`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ status: newStatus })
            
        })
        .then(res => {
        if (!res.ok) throw new Error('Erreur réseau');
        return res.json(); // On retourne la promesse ici
        })
        .then((data) => {
            // 'data' contient maintenant l'utilisateur mis à jour renvoyé par le backend
            console.log("Données reçues :", data);
            console.log(data.status);
            console.log(user.status);

            setUsers(prev =>
                prev.map(u => (u.id == data.id) ? { ...u, status: newStatus } : u)
            );
        })
        .catch(error => {
            console.error('Erreur lors de la mise à jour du statut:', error);
        });
    };

    return (
        <>
        <h1>Gestion des Utilisateurs</h1>
        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Nom</th>
                    <th>Nom d'utilisateur</th>
                    <th>mot de passe</th>
                    <th>role</th>
                    <th>status</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
        {
           users.map(user => {
            return(
                <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.name}</td>
                    <td>{user.username}</td>
                    <td>{user.password}</td>
                    <td>{user.role}</td>
                    <td>{(user.status)? "Actif" : "Inactif"}</td>
                    <td>
                        <button className='enableBtn' onClick={() => switchEtat(user)}>
                            {user.status ? 'Désactiver' : 'Activer'}
                            </button>
                    </td>
                </tr>
            )
           }) 
        }
            </tbody>
        </table>
        </>
    )
}

export default ApiAdmin;