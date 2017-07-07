# bamazon

A project for University of Arizona Coding Bootcamp featuring Node.js and MYSQL

bamazon consists of three CLI applications that provide a Customer, Manager, and Supervisor view of an Amazon-like 
store.

### [bamazon in action on Youtube](https://youtu.be/i47-i1prImk)


### bamazonCustomer.js

bamazonCustomer.js queries a MYSQL database and lists all products available 'for sale'.  It also allows the user to 'buy' 
a product and subsequently updates the database.

### bamazonManager.js

bamazonManager.js can view and modify product data.  The user can view either all available products or just those that 
are low availability.  The user can then add inventory to any product or list another product altogether.

### bamazonSupervisor.js

bamazonSupervisor.js allows the user to view the sales for each department or add another department to the database.


*example table*
First Header | Second Header
------------ | -------------
Content from cell 1 | Content from cell 2
Content in the first column | Content in the second column




Customer | Manager | Supervisor
---------|---------|-----------
buy products | edit products | view sales/edit dept
Content in the first column | Content in the second column | more content

