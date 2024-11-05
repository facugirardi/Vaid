# Consigna 1

CREATE OR REPLACE VIEW order_annual_inform AS
	SELECT s.ShipperID AS IDProveedor, s.CompanyName AS NombreProveedor, c.CategoryName AS Categoria, COUNT(o.OrderID) AS CantidadOrdenes,
    SUM(od.Quantity) AS CantidadProductosAdquiridos, SUM((od.UnitPrice*od.Quantity) - od.Discount) AS TotalRecaudadoNeto, SUM(od.UnitPrice*od.Quantity) AS TotalRecaudado,
	MAX(OrderDate)  AS FechaDeOrdenMasReciente, MIN(OrderDate) AS FechaDeOrdenMasAntigua
    FROM Shippers s
    INNER JOIN Orders o ON o.ShipVia = s.ShipperID
    INNER JOIN OrderDetails od ON od.OrderID = o.OrderID
    INNER JOIN Products p ON p.ProductID = od.ProductID
    INNER JOIN Categories c ON c.CategoryID = p.CategoryID
    
    WHERE YEAR(o.ShippedDate) = (SELECT YEAR(OrderDate) FROM Orders ORDER BY OrderDate DESC LIMIT 1)
    
    GROUP BY s.ShipperID, c.CategoryName;
			
SELECT * FROM order_annual_inform;            


# Consigna 2

DROP PROCEDURE IF EXISTS listaEmpleados;
DELIMITER $$ 
CREATE PROCEDURE listaEmpleados( IN ciudad VARCHAR(250), OUT lista TEXT)
BEGIN
DECLARE fin INT DEFAULT 0;
DECLARE empleado VARCHAR(250); 

DECLARE cursor_emp CURSOR FOR 
SELECT CONCAT(FirstName, ' ', LastName) AS NombreCompleto
FROM Employees
WHERE City LIKE ciudad; 

DECLARE CONTINUE HANDLER FOR NOT FOUND SET fin = 1; 

SET lista = '';
OPEN cursor_emp; 

loop_empleados : LOOP

FETCH cursor_emp INTO empleado; 

IF fin = 1 THEN
	LEAVE loop_empleados;
END IF; 

SET lista = CONCAT(lista, empleado, ';'); 
END LOOP; 

CLOSE cursor_emp; 

END$$ 
DELIMITER ; 

CALL listaEmpleados('London', @lista);

SELECT @lista;


# Consigna 3

ALTER TABLE Orders ADD COLUMN lastModification DATETIME;
ALTER TABLE Orders ADD COLUMN lastModifierUser VARCHAR(100);

DROP TRIGGER IF EXISTS beforeUpdateOrders;
DROP TRIGGER IF EXISTS beforeInsertOrders;

DELIMITER $$ 
CREATE TRIGGER beforeUpdateOrders
BEFORE UPDATE ON Orders 
FOR EACH ROW 
BEGIN 
SET NEW.lastModification = NOW(); 
SET NEW.lastModifierUser = CURRENT_USER(); 

IF NEW.ShipVia = 1 THEN
	SET NEW.ShippedDate = NOW();
END IF;
END$$ 
DELIMITER ; 

DELIMITER $$ 
CREATE TRIGGER beforeInsertOrders
BEFORE INSERT ON Orders
FOR EACH ROW 
BEGIN 
SET NEW.lastModification = NOW(); 
SET NEW.lastModifierUser = CURRENT_USER(); 

IF NEW.ShipVia = 1 THEN
	SET NEW.ShippedDate = NOW();
END IF;

END$$
DELIMITER ;


# Consigna 4

/*

Los indices se utilizan para mejorar el rendimiento en las busquedas de una base de datos. Estos funcionan como el indice de un libro, pero en vez de estar
dirigido a capitulos, estos estan dirigidos a columnas de una tabla.
Los constraints, en cambio, se pueden llamar atributos o parametros para columnas como por ejemplo PRIMARY KEY, NOT NULL, entre otros.

Un ejemplo sencillo de un indice puede ser el siguiente:
	
 */

CREATE FULLTEXT INDEX ind_CategoryName ON Categories(CategoryName);

/* 

Este ejemplo es un indice fulltext sobre la tabla Categories y en la columna CategoryName. 

*/