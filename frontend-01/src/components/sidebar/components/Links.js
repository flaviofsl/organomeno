/* eslint-disable */
import React from "react";
import { NavLink, useLocation } from "react-router-dom";
// chakra imports
import { Box, Flex, HStack, Text, useColorModeValue, Icon, useDisclosure } from "@chakra-ui/react";
// Assets
import { GoChevronDown, GoChevronRight } from "react-icons/go";

export function SidebarLinks(props) {
  //   Chakra color mode
  let location = useLocation();
  let activeColor = useColorModeValue("gray.700", "white");
  let inactiveColor = useColorModeValue(
    "secondaryGray.600",
    "secondaryGray.600"
  );
  let activeIcon = useColorModeValue("brand.500", "white");
  let textColor = useColorModeValue("secondaryGray.500", "white");
  let brandColor = useColorModeValue("brand.500", "brand.400");

  const { routes } = props;

  // verifies if routeName is the one active (in browser input)
  const activeRoute = (routeName) => {
    return location.pathname.includes(routeName);
  };

  // Component for collapse items (dropdowns)
  const CollapseItem = ({ route, index }) => {
    const { isOpen, onToggle } = useDisclosure();
    let hoverBg = useColorModeValue("gray.50", "gray.700");
    
    return (
      <Box key={index}>
        <Box
          onClick={onToggle}
          cursor='pointer'
          py='5px'
          ps='10px'
          _hover={{ bg: hoverBg }}
          borderRadius='8px'
          mb='2px'>
          <HStack spacing={route.icon ? "22px" : "26px"}>
            <Flex w='100%' alignItems='center' justifyContent='center'>
              {route.icon && (
                <Box
                  color={textColor}
                  me='18px'>
                  {route.icon}
                </Box>
              )}
              <Text
                me='auto'
                color={textColor}
                fontWeight='normal'>
                {route.name}
              </Text>
            </Flex>
            <Icon
              as={isOpen ? GoChevronDown : GoChevronRight}
              color={textColor}
              w='16px'
              h='16px'
            />
          </HStack>
        </Box>
        {isOpen && route.items && (
          <Box ps='20px' mt='2px'>
            {createLinks(route.items)}
          </Box>
        )}
      </Box>
    );
  };

  // this function creates the links from the secondary accordions (for example auth -> sign-in -> default)
  const createLinks = (routes) => {
    return routes.map((route, index) => {
      if (route.category) {
        return (
          <>
            <Text
              fontSize={"md"}
              color={activeColor}
              fontWeight='bold'
              mx='auto'
              ps={{
                sm: "10px",
                xl: "16px",
              }}
              pt='18px'
              pb='12px'
              key={index}>
              {route.name}
            </Text>
            {createLinks(route.items)}
          </>
        );
      } else if (route.collapse) {
        return <CollapseItem route={route} index={index} />;
      } else if (route.layout && route.path) {
        return (
          <NavLink key={index} to={route.layout + route.path}>
            {route.icon ? (
              <Box>
                <HStack
                  spacing={
                    activeRoute(route.path.toLowerCase()) ? "22px" : "26px"
                  }
                  py='5px'
                  ps='10px'>
                  <Flex w='100%' alignItems='center' justifyContent='center'>
                    <Box
                      color={
                        activeRoute(route.path.toLowerCase())
                          ? activeIcon
                          : textColor
                      }
                      me='18px'>
                      {route.icon}
                    </Box>
                    <Text
                      me='auto'
                      color={
                        activeRoute(route.path.toLowerCase())
                          ? activeColor
                          : textColor
                      }
                      fontWeight={
                        activeRoute(route.path.toLowerCase())
                          ? "bold"
                          : "normal"
                      }>
                      {route.name}
                    </Text>
                  </Flex>
                  <Box
                    h='36px'
                    w='4px'
                    bg={
                      activeRoute(route.path.toLowerCase())
                        ? brandColor
                        : "transparent"
                    }
                    borderRadius='5px'
                  />
                </HStack>
              </Box>
            ) : (
              <Box>
                <HStack
                  spacing={
                    activeRoute(route.path.toLowerCase()) ? "22px" : "26px"
                  }
                  py='5px'
                  ps='10px'>
                  <Text
                    me='auto'
                    color={
                      activeRoute(route.path.toLowerCase())
                        ? activeColor
                        : inactiveColor
                    }
                    fontWeight={
                      activeRoute(route.path.toLowerCase()) ? "bold" : "normal"
                    }>
                    {route.name}
                  </Text>
                  <Box 
                    h='36px' 
                    w='4px' 
                    bg={
                      activeRoute(route.path.toLowerCase())
                        ? brandColor
                        : "transparent"
                    } 
                    borderRadius='5px' 
                  />
                </HStack>
              </Box>
            )}
          </NavLink>
        );
      }
    });
  };
  //  BRAND
  return createLinks(routes);
}

export default SidebarLinks;
