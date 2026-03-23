const Menu = () => {
  return (
    <nav>
      <ul>
        <li>
          <a href="/">Dashboard</a>
        </li>
        <li>
          <a href="/situations/list">Situações</a>
        </li>
        <li>
          <a href="/product-situations/list">Situações Produtos</a>
        </li>
        <li>
          <a href="/product-categories/list">Categorias Produtos</a>
        </li>
      </ul>
    </nav>
  );
};

export default Menu;
