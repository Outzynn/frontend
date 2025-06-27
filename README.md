Modificamos el endpoint /login del backend para que no requiera un "nombre" ya que en el frontend no se proporciona. Ademas no lo vimos util que busque en la base de datos (para verificar si existe ese user) por nombre y usuario cuando ya el usuario es unico y alcanza para la verificacion.

Modificamos el endpont /estadisticas del backend para que devuelva el nombre publico del usuario junto a sus stats y no el id.

Agregamos un endpont GET /mazos/{mazo} que nos lista las cartas del mazo cuyo id le pasamos por argumento. Esto se hizo para poder resolver el inciso e- Mis mazos - Ver Mazo: se muestra en un modal las cartas que lo componen.

Modificamos levemente el endopoit GET /cartas para que tambien procese cuando recibe un atributo vacio (""). No solamente cuando es null.