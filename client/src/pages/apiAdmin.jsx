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
                </tr>
            </thead>
            <tbody>
        {
           users.map(user => {
            console.log(user);
            return(
                <tr key='{user.id}'>
                    <td>{user.id}</td>
                    <td>{user.name}</td>
                    <td>{user.username}</td>
                    <td>{user.password}</td>
                    <td>{user.role}</td>
                    <td>{(user.status)? "Actif" : "Inactif"}</td>
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