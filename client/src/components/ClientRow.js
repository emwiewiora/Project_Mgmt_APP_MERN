import {FaTrash} from 'react-icons/fa';
import {useMutation} from '@apollo/client';
import { DELETE_CLIENT } from '../mutations/clientMutations';
import { GET_CLIENTS } from '../queries/clientQueries';


export default function ClientRow({ client }) {
  const [deleteClient] = useMutation(DELETE_CLIENT, {
    variables: { id: client.id },
    // this will refresh the client list by getting the clients list from the DB again. This will bog things down when using more data and more concurent users.
    // refetchQueries: [{ query: GET_CLIENTS }],

    // This method simply refreshes the data from the pages cashe.
    //   Then filters out the id we selected to delete and
    //   writes the new data to the pages cashe. 
    //   this allows you to do this function repeatidly.
    //   This is a lighter weight method
    update(cache, { data: {deleteClient}}) { 
      const { clients } = cache.readQuery({ query: GET_CLIENTS });
      cache.writeQuery({
        query: GET_CLIENTS,
        data: { clients: clients.filter(client => client.id !== deleteClient.id) },
      });
    }
  });

  return (
    <tr>
        <td>{ client.name }</td>
        <td>{ client.email }</td>
        <td>{ client.phone }</td>
        <td>
            <button className="btn btn-danger btn-sm" onClick={deleteClient}>
                <FaTrash />
            </button>
        </td>
    </tr>
  )
}
