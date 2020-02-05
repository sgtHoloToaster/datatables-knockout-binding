datatables-knockout-binding
==================

Knockout.js binding for jQuery Datatables.

# Usage
Just add the 'datatable' binding to your table body along with your array 

	<tbody data-bind="datatable: someArray">  
      ...  
  
now inside of the table body you can use properties of the array element

      <tr>  
        <td data-bind="text: someProperty"></td>  
          ...
  
This is it! Just like the standard knockout foreach binding.

If you need to specify Datatables options, then just add the tableOptions binding:

	<tbody data-bind="datatable: someArray, tableOptions: { paging: false }">
      ...

# Installation
### Using npm

	npm install datatables-knockout-binding
