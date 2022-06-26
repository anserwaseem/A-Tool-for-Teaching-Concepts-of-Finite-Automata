function TableRows({ rowsData, deleteTableRows, handleChange }) {
  return rowsData.map((data, index) => {
    const { node, a, b } = data;
    return (
      <tr key={index}>
        <td>
          <input
            type="text"
            value={node}
            onChange={(evnt) => handleChange(index, evnt)}
            name="node"
            className="form-control"
          />
        </td>
        <td>
          <input
            type="text"
            value={a}
            onChange={(evnt) => handleChange(index, evnt)}
            name="a"
            className="form-control"
          />{" "}
        </td>
        <td>
          <input
            type="text"
            value={b}
            onChange={(evnt) => handleChange(index, evnt)}
            name="b"
            className="form-control"
          />{" "}
        </td>
        <td>
          <button
            className="btn btn-outline-danger"
            onClick={() => deleteTableRows(index)}
          >
            x
          </button>
        </td>
      </tr>
    );
  });
}

export default TableRows;
