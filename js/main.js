/************************************
 * WEB422-ASSIGNMENT2
 * I declare that assignment is my own work in accordance with Seneca Academic
 * POlicy. NO part of this assignment has been copied manually or electrically
 * from other source(including websites) or distributed to other students
 * 
 * Name: Jianwen Yang Students ID: 153169180 Date: June 8 2020
 ***********************************/


let saleData = new Array();
let page = 1;
const perPage = 10;

let saleTableTemplate=_.template(`
<% _.forEach(sales,sale=>{ %>
    <tr data-id="<%= sale._id %>">
        <td><%= sale.customer.email %></td>
        <td><%= sale.storeLocation %></td>
        <td><%= sale.items.length %></td>
        <td><%= moment(sale.saleDate).format('LLLLL') %></td>
    </tr>    

<% }) %>`);


let saleModalTemplate=_.template(`
<h4>Customer</h4>
<strong>email: </strong><%= sale.customer.email %><br>
<strong>age: </strong><%= sale.customer.age %><br>
<strong>satisfaction:</strong><%=sale.customer.satisfaction %> /5 <br><br>
<h4>Items: $<%=sale.total.toFixed(2) %> </h4>
<table class="table">
<thead>
    <tr>
        <th>Product Name</th>
        <th>Quantity</th>
        <th>Price</th>
    </tr>
</thead>
<tbody>    
<% _.forEach(sale.items,item=>{ %>
    <tr>
        <td><%= item.name %></td>
        <td><%= item.quantity %></td>
        <td><%= item.price %></td>
    </tr>    

<% }); %>
</tbody>
</table>
`);

function loadSaleData(){
    fetch(`https://web-practice-summer2020.herokuapp.com/api/sales?page=${page}&perPage=${perPage}`)
    .then(data=>data.json())
    .then(sales=>{
        //saleData=_.cloneDeep(sales);
        saleData=sales;
        //console.log(saleData===sales);
        $("#sale-table tbody").html(saleTableTemplate({sales}));
        $("#currentPage").html(page);
    });
}

$(function(){
    loadSaleData();

    $('#sale-table tbody').on("click", "tr",(e)=>{
        
        let itemId = $(e.currentTarget).attr("data-id");
        
        
        let sale= _.find(saleData,{_id: `${itemId}` });
        sale.total=0;
        sale.items.forEach(item=>{
            sale.total += (item.price*item.quantity);
        });
        console.log(itemId);
        $("#saleModal .modal-title").html(`Sale: ${sale._id}`);
        $("#saleModal .modal-body").html(saleModalTemplate({sale}));
        $("#saleModal").modal({
            keyboard:false,
            backdrop:'static'
        });
    });

    $(".pagination").on("click","#previousPage", ()=>{
    if(page>1){
        page--;
    }
    loadSaleData();
    });

    $(".pagination").on("click","#nextPage", ()=>{
       
    if(saleData.length===10){
        //console.log(saleData.length);
        page++;
    }
    
    loadSaleData();
    });
});