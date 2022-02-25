import {
  Table,
  Typography,
  TableRow,
  TableCell,
  Grid,
  Button,
  CircularProgress,
} from "@mui/material"
import { useState } from "react"
import "./App.css"
import { styled } from "@mui/material/styles"
import Stack from "@mui/material/Stack"
import tableIcon from "../src/assets/images/tableIcon.png"
import axios from "axios"
import * as XLSX from "xlsx"

function App() {
  const [tableInfo, setTableInfo] = useState([])
  const [selectedFile, setSelectedFile] = useState(null)
  const [loading, setLoading] = useState(false)

  const Input = styled("input")({
    display: "none",
  })

  const onChangeHandler = (event) => {
    setSelectedFile(event.target.files[0])
    setTableInfo([])
  }

  const onClickHandler = () => {
    setLoading(true)
    let data = new FormData()
    data.append("file", selectedFile) //default filename = blob

    axios
      .post("http://localhost:3000/server", data, {
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      })
      .then((response) => {
        console.log(response.data)
        setTableInfo(response.data)
        setLoading(false)
      })
      .catch((error) => {
        console.log(error)
      })
  }

  const downloadExcelFile = () => {
    //Table Array Assembly
    let tableArray = []
    for (let i = 0; i < tableInfo.length; i++) {
      let rowArray = []
      for (let j = 0; j < tableInfo[i].data.length; j++) {
        let celArray = []
        for (let k = 0; k < tableInfo[i].data[j].length; k++) {
          celArray.push(tableInfo[i].data[j][k].text)
        }
        rowArray.push(celArray)
      }
      tableArray.push(rowArray)
    }

    //Excel Assembly
    const wb = XLSX.utils.book_new()
    for (let i = 0; i < tableArray.length; i++) {
      let ws_data = tableArray[i]
      const ws = XLSX.utils.aoa_to_sheet(ws_data)
      XLSX.utils.book_append_sheet(wb, ws, `Tabela ${i}`)
    }
    XLSX.writeFile(wb, "Tabelas Exportadas.xlsx")
  }

  const tableAssembly = () => {
    return tableInfo.map((table, index) => (
      <Table className="tablePDF" key={index}>
        {table.data.map((row, index) => (
          <TableRow key={index}>
            {row.map((cel, index) => (
              <TableCell key={index}>{cel.text}</TableCell>
            ))}
          </TableRow>
        ))}
      </Table>
    ))
  }

  return (
    <div className="App">
      <Grid className="gridTop">
        <Grid className="gridSecondary">
          <img src={tableIcon} alt="table icon" className="imageTable" />
          <Grid style={{ marginRight: "50px" }}>
            <Typography className="titlePrincipal" variant="h2">
              POC PDF
            </Typography>
            <Typography className="titleSub" variant="h5">
              Extraia tabelas de qualquer arquivo PDF!
            </Typography>
          </Grid>
        </Grid>
        <Grid className="gridTernario">
          <Stack direction="row" alignItems="center" spacing={2}>
            <label htmlFor="contained-button-file">
              <Input
                accept="pdf"
                id="contained-button-file"
                type="file"
                onChange={onChangeHandler}
              />
              <Button variant="contained" component="span" color="secondary">
                Selecionar PDF
              </Button>
            </label>
          </Stack>
          <Typography
            style={{
              backgroundColor: "#f4f4f4",
              padding: "5px",
              paddingLeft: "10px",
              margin: "0 30px",
              flexGrow: "1",
              borderRadius: "5px",
              textAlign: "left",
            }}
          >
            {selectedFile?.name}
          </Typography>
          <Button
            variant="contained"
            color="secondary"
            onClick={onClickHandler}
            disabled={!selectedFile || loading || tableInfo[0]}
          >
            Extrair
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={downloadExcelFile}
            disabled={!tableInfo[0] || !selectedFile}
            style={{ marginLeft: "15px" }}
          >
            Download Excel
          </Button>
        </Grid>
        <Grid style={{ paddingBottom: "30px"}}>
          {loading ? (
            <Grid className="gridLoading">
              <CircularProgress color="secondary" />
            </Grid>
          ) : (
            tableInfo && tableAssembly()
          )}
        </Grid>
      </Grid>
    </div>
  )
}

export default App
