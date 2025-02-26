<nav>
	<a href="/canasta">Kanasta</a>
  <a href="/bridge">Brydż</a>
	<a href="/about">Admin</a>
</nav>

<body>
<script>
  // import {globalPIN} from '/';
</script>


</body>

<svelte:head>
  <style>
    body {
      font-family: "Montserrat", sans-serif;
      font-size: 1.5rem;
      background-color: rgb(98, 215, 176);
      }
    
      a{ text-decoration: none;
      font-size: 0.8rem;
      color: #16125c;
      transition: color 0.3s;
        &:hover{
        color: #ef4f4f;
        }
     }  
    
      nav {
      text-align: right;
      font-family: "Montserrat", sans-serif;
      font-size: 1.5rem;
      }
    
    
    </style>  
</svelte:head>

<slot></slot>
