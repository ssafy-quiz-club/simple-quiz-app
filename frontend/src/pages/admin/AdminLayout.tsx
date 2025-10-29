import { NavLink, Outlet } from 'react-router-dom';
import styled from 'styled-components';

export function AdminLayout() {
  return (
    <LayoutContainer>
      <NavBar>
        <NavHeader>관리자 메뉴</NavHeader>
        <NavList>
          <NavItem>
            <StyledNavLink to="/admin/lectures">강의 관리</StyledNavLink>
          </NavItem>
          <NavItem>
            <StyledNavLink to="/admin/questions">문제 목록</StyledNavLink>
          </NavItem>
          <NavItem>
            <StyledNavLink to="/admin/upload">문제 추가</StyledNavLink>
          </NavItem>
        </NavList>
      </NavBar>
      <Content>
        <Outlet />
      </Content>
    </LayoutContainer>
  );
}

const LayoutContainer = styled.div`
  display: flex;
  height: calc(100vh - 80px); // 헤더 높이를 뺀 나머지
`;

const NavBar = styled.nav`
  width: 240px;
  background: #111827;
  border-right: 1px solid #334155;
  padding: 24px;
  display: flex;
  flex-direction: column;
`;

const NavHeader = styled.h2`
  font-size: 20px;
  color: #e5e7eb;
  margin: 0 0 24px 0;
`;

const NavList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const NavItem = styled.li``;

const StyledNavLink = styled(NavLink)`
  display: block;
  padding: 12px 16px;
  color: #cbd5e1;
  text-decoration: none;
  border-radius: 8px;
  font-weight: 500;

  &:hover {
    background: #1f2937;
  }

  &.active {
    background: #2a6df3;
    color: white;
  }
`;

const Content = styled.main`
  flex: 1;
  padding: 32px;
  overflow-y: auto;
  background: #0d1117;
`;
