import { Button, useColorModeValue, useMediaQuery } from "@chakra-ui/react";

type selectedId = number | null;

interface CategorySelectProps {
    categories: global.Category[];
    selectedId: selectedId;
    onChange: (selectedId: selectedId) => void;
}

const CategorySelect = ({
    categories,
    selectedId,
    onChange,
}: CategorySelectProps) => {
    const [isLargerThan768] = useMediaQuery("(min-width: 768px)");
    const buttonColor = useColorModeValue("white", "gray.800");
    const textColor = useColorModeValue("black", "gray.300");

    const categoryClickHandler = (id: number) => {
        if (selectedId === id) {
            onChange(null);
        } else {
            onChange(id);
        }
    };

    return (
        <>
            {categories.map((categoryObj) => (
                <Button
                    minW={isLargerThan768 ? "full" : " auto"}
                    minH={"40px"}
                    boxShadow={"md"}
                    borderRadius={8}
                    variant={"solid"}
                    size={"md"}
                    bgColor={buttonColor}
                    color={textColor}
                    _hover={{
                        transform: "scale(1.05)",
                    }}
                    _active={{
                        bg: "gray.600",
                        color: "white",
                    }}
                    isActive={categoryObj.id === selectedId}
                    key={categoryObj.id}
                    onClick={() => categoryClickHandler(categoryObj.id)}
                >
                    {categoryObj.name}
                </Button>
            ))}
        </>
    );
};

export default CategorySelect;
