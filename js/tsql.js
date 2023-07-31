const CONNEC_TSQL = "http://192.168.0.148/data/tsql.php";
//const CONNEC_TSQL = "http://localhost/data/tsql.php";

export function createQuerySQL(type, params) {
  if (typeof type !== "string") {
    throw new Error("type debe ser un string");
  }

  if (type == "update" || type == "delete") {
    if (!params["w"]) {
      throw new Error("params['w'] debe estar definido dentro del objeto");
    }
  }

  if (type == "update" && !params["d"]) {
    throw new Error("params['d'] debe estar definido dentro del objeto");
  }

  if (!(params instanceof Object)) {
    throw new Error("params debe ser un objeto");
  }

  if (!params["t"]) {
    throw new Error("params['t'] debe estar definido dentro del objeto");
  }

  const order = params["o"] || null;
  const columns = params["c"] || "*";
  const table = params["t"];
  const join = params["j"] || null;
  const data = params["d"] || null;
  const where = params["w"] || null;
  const limit = params["l"] || 100;

  let query = "";
  switch (type) {
    case "select":
      query += `SELECT ${columns} FROM ${table}`;
      if (join) query += ` ${join}`;
      if (where) query += ` WHERE ${where}`;
      if (order) query += ` ORDER BY ${order}`;
      query += ` LIMIT ${limit}`;
      break;
    case "insert":
      let columnsInsert = "";
      let valuesInsert = "";
      if (data) {
        let keys = Object.keys(data);
        for (let i = 0; i < keys.length; i++) {
          let key = keys[i];
          let value = data[key] ?? null;
          columnsInsert += ` ${key},`;
          if (typeof value === "string") value = `'${value}'`;
          valuesInsert += ` ${value},`;
        }
        columnsInsert = columnsInsert.slice(0, -1);
        valuesInsert = valuesInsert.slice(0, -1);
      }
      query += `INSERT INTO ${table} (${columnsInsert}) VALUES (${valuesInsert})`;
      break;
    case "update":
      query += `UPDATE ${table} SET`;
      if (data) {
        let keys = Object.keys(data);
        for (let i = 0; i < keys.length; i++) {
          let key = keys[i];
          let value = data[key] ?? null;
          if (typeof value === "string") value = `'${value}'`;
          query += ` ${key} = ${value}`;
          if (i < keys.length - 1) query += ",";
        }
      }
      if (where) query += ` WHERE ${where}`;
      break;
    case "delete":
      query += `DELETE FROM ${table}`;
      if (where) query += ` WHERE ${where}`;
      break;
  }

  return query;
}

function codeTSQL(frase) {
  let lista = [
    { buscar: "select", cambiarPor: "-lectes" },
    { buscar: "*", cambiarPor: "-kuiki" },
    { buscar: "from", cambiarPor: "-morf" },
    { buscar: "inner", cambiarPor: "-nerin" },
    { buscar: "join", cambiarPor: "-injo" },
    { buscar: "update", cambiarPor: "-teupda" },
    { buscar: "delete", cambiarPor: "-tedele" },
    { buscar: "insert", cambiarPor: "-sertint" },
    { buscar: "values", cambiarPor: "-luesva" },
    { buscar: "set", cambiarPor: "-tes" },
    { buscar: "into", cambiarPor: "-toin" },
    { buscar: "where", cambiarPor: "-rewhe" },
    { buscar: "as", cambiarPor: "-sa" },
    { buscar: "on", cambiarPor: "-no" },
    { buscar: "or", cambiarPor: "-ro" },
    { buscar: "and", cambiarPor: "-ty" },
    { buscar: "order", cambiarPor: "-enor" },
    { buscar: "by", cambiarPor: "-yb" },
    { buscar: "desc", cambiarPor: "-csed" },
    { buscar: "asc", cambiarPor: "-cas" },
    { buscar: "<", cambiarPor: "-nim" },
    { buscar: ">", cambiarPor: "-xam" },
    { buscar: "<>", cambiarPor: "-nimxam" },
  ];

  frase = frase.replace(";", " ");
  // Primero, reemplazamos todos los saltos de línea y tabulaciones por un espacio en blanco
  frase = frase.replace(/(\r\n|\n|\r|\t)/gm, " ");
  // Luego, reemplazamos cualquier secuencia de espacios en blanco por un solo espacio
  frase = frase.replace(/\s+/g, " ");
  let arrayFrase = frase.split(" ");
  let newFrase = arrayFrase.map((parte) => {
    let busca = parte.toLowerCase();
    let valor = lista.find((obj) => obj.buscar == busca);
    return valor ? valor.cambiarPor : parte;
  });
  frase = newFrase.join("tmn");
  return frase;
}

function decodeTSQL(frase) {
  let lista = [
    { cambiarPor: "SELECT", buscar: "-lectes" },
    { cambiarPor: "*", buscar: "-kuiki" },
    { cambiarPor: "FROM", buscar: "-morf" },
    { cambiarPor: "INNER", buscar: "-nerin" },
    { cambiarPor: "JOIN", buscar: "-injo" },
    { cambiarPor: "UPDATE", buscar: "-teupda" },
    { cambiarPor: "DELETE", buscar: "-tedele" },
    { cambiarPor: "INSERT", buscar: "-sertint" },
    { cambiarPor: "VALUES", buscar: "-luesva" },
    { cambiarPor: "SET", buscar: "-tes" },
    { cambiarPor: "INTO", buscar: "-toin" },
    { cambiarPor: "WHERE", buscar: "-rewhe" },
    { cambiarPor: "AS", buscar: "-sa" },
    { cambiarPor: "ON", buscar: "-no" },
    { cambiarPor: "OR", buscar: "-ro" },
    { cambiarPor: "AND", buscar: "-ty" },
    { cambiarPor: "ORDER", buscar: "-enor" },
    { cambiarPor: "BY", buscar: "-yb" },
    { cambiarPor: "ASC", buscar: "-cas" },
    { cambiarPor: "DESC", buscar: "-csed" },
    { cambiarPor: "<", buscar: "-nim" },
    { cambiarPor: ">", buscar: "-xam" },
    { cambiarPor: "<>", buscar: "-nimxam" },
  ];

  let arrayFrase = frase.split("tmn");

  let newFrase = arrayFrase.map((parte) => {
    let busca = parte.toLowerCase();
    let valor = lista.find((obj) => obj.buscar == busca);
    return valor ? valor.cambiarPor : parte;
  });
  frase = newFrase.join(" ");
  return frase;
}


export function setSQL(tabla, json) {
  let dataForSave = {};
  let elValor = "";
  let keyPrimary = "";
  let sql = "";
  let where = "";
  let tipoSQL = "";
  let camposIncompletos = "";
  let typeInput = "";
  let respuesta = {};

  if (tabla && json) {
    // let formValues = Object.values(json).map((field) => field.value);
    // alert(`Valores ingresados: ${formValues.join(", ")}`);
    let comprobation = Object.values(json).filter((field) => {
      if (field.required == true) {
        if (!field.value) {
          camposIncompletos += field.placeholder + ", ";
          return field.name;
        }
      }
    });

    if (!comprobation.length) {
      for (const key in json) {
        if (json[key].key == "primary") {
          if (typeInput == "integer") {
            where = `${key} = ${json[key].value}`;
            keyPrimary = parseInt(json[key].value);
          } else {
            where = `${key} = '${json[key].value}'`;
            keyPrimary = json[key].value;
          }
          tipoSQL = json[key].value == 0 ? "insert" : "update";
        } else {
          typeInput = json[key].type;
          if (typeInput == "integer") {
            if (json[key].value) {
              elValor = parseInt(json[key].value);
            } else {
              elValor = null;
            }
          } else if (typeInput == "currency") {
            if (json[key].value) {
              elValor = parseFloat(json[key].value);
            } else {
              elValor = null;
            }
          } else {
            elValor = json[key].value;
          }
          //console.log(elValor);
          dataForSave[key] = elValor;
        }
      }

      console.log(dataForSave);
      sql = createQuerySQL(tipoSQL, {
        t: tabla,
        w: where,
        d: dataForSave,
      });

      console.log(sql);
      respuesta = {
        status: 1,
        tipo: tipoSQL,
        keyPrimary: keyPrimary,
        sql: sql,
        camposIncompletos: camposIncompletos,
      };
    } else {
      respuesta = {
        status: 0,
        tipo: "",
        keyPrimary: keyPrimary,
        sql: "",
        camposIncompletos: camposIncompletos,
      };
    }
  }
  return respuesta;
}



export async function dbSelect(type, sql) {
  let datos = {
    tipo: type.charAt(0),
    tsql: codeTSQL(sql),
  };

  try {
    const resp = await fetch(CONNEC_TSQL, {
      method: "POST",
      body: JSON.stringify({
        data: datos,
      }),
    });

    const result = await resp.json();
    return result;
  } catch (error) {
    const err = [{ resp: "error", msgError: "Error al consultar datos!" }];
    return err;
  }
}
