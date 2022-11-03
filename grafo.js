console.log ("Hola desde grafo")

d3.json("https://gist.githubusercontent.com/mbostock/4062045/raw/5916d145c8c048a6e3086915a6be464467391c62/miserables.json").then (function(data){

          console.log ("Estamos dentro")   
    
        // ESCALA DE COLORES
        var escalaColor = d3.scaleOrdinal(d3.schemeCategory10) // definimos la esca de color para los nodos
        
        // Configuramos las fuerzas
        var layout = d3.forceSimulation()
            .force("link", d3.forceLink().id(d=>d.id)) // fuerza de los enlaces a través del id de los nodos
            .force("charge", d3.forceManyBody()) //para que aleje los objetos entre si y no se solapen
            .force("center", d3.forceCenter(250,250)) // a aprtir de cual coordena empiece a contruir la visua..
        
        layout
            .nodes(data.nodes) //tome la info de nodes 
            .on("tick",onTick) // cada vez que exista un cambio llame a esta función
    
        layout  
            .force("link") // fuerza de los enlaces 
            .links(data.links) //su orien de los datos sea de este campo
    
        
        // 1 CREAR NUESTRO SVG
        var svg = d3.select("body") //asocio el gráfico a la etiqueta <body>
            .append("svg") //añadimos la etiqueta svg
            .attr("width", 600) // se definen las dimensiones del gráfico
            .attr("height", 600)
        
        // Respetamos el orden, debido a que D3 pinta los objetos acuerdo al ordende estos.
        // para que primero haga las lineas y luego los circulo, asi las lineas no quedaran super puestas 
        //en los circulos. Creamos las lineas a continuación....
        // 2. PINTAMOS LINEAS Y DESPUES NODOS
        var links= svg
            .append ("g") //creamos el grupo
            .selectAll("line") //selccionamos todos los enlaces que hagan falta - lineas
            .data(data.links) //links porque alli esta los datos referentes a las lineas
            .enter() //ejecutamos
            .append("line") //añadimos las lineas
            .style ("stroke-width", d=>d.value/5) 
            //agregamos el estilo y el grosor acuerdo a el valor de value, para que este sea dinamico
                    
        // 8. PINTAMOS LOS ENLACES CON COLORES
            .style ("stroke", d => {
                if (d.source.group == d.target.group)
                    return (escalaColor(d.source.group))
                else
                    return ("#aaa")       
            })
        
        
        // 3. PINTAMOS LOS NODOS
        var nodes = svg 
            .append("g") //creamos el grupo
            .selectAll("circle") //seleccionamos los circulos que hagan falta
            .data(data.nodes) // nodos acuerdo a los datos y campo node
            .enter()
            .append("circle")
            .attr("r",7) //se define el radio de los circulos.
                    
        // 7. APLICAR UNA ESCALA DE COLORES
            .attr("fill", d=>escalaColor(d.group)) //rellena de color con la escala y tomando el valor del grupo
                                          
        // FUNCION ONTICK
        function onTick(){
          nodes
            .attr("cx", d => d.x) //define las coordenadas de los nodos
            .attr("cy", d => d.y) // d guarda el valor en cada iteracion al recorrer los datos -- el i en un for
           links
            .attr("x1", d => d.source.x) //se definen las corrdenadas de los enlaces
            .attr("x2", d => d.target.x)
            .attr("y1", d => d.source.y)
            .attr("y2", d => d.target.y)
         }         
          
})