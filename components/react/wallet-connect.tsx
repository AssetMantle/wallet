import { Icon, Stack, Text, useColorModeValue } from "@chakra-ui/react";
import { WalletStatus } from "@cosmos-kit/core";
import { HtmlProps } from "next/dist/shared/lib/html-context";
import Image from "next/image";
import { MouseEventHandler, ReactNode } from "react";
import { FiAlertTriangle } from "react-icons/fi";
import { ConnectWalletType } from "../types";

/* export const ConnectWalletButton = ({
  buttonText,
  isLoading,
  isDisabled,
  icon,
  onClickConnectBtn,
}: ConnectWalletType) => {
  return (
    <Button
      w="full"
      minW="fit-content"
      size="lg"
      isLoading={isLoading}
      isDisabled={isDisabled}
      bgImage="linear-gradient(109.6deg, rgba(157,75,199,1) 11.2%, rgba(119,81,204,1) 83.1%)"
      color="white"
      opacity={1}
      transition="all .5s ease-in-out"
      _hover={{
        bgImage:
          "linear-gradient(109.6deg, rgba(157,75,199,1) 11.2%, rgba(119,81,204,1) 83.1%)",
        opacity: 0.75,
      }}
      _active={{
        bgImage:
          "linear-gradient(109.6deg, rgba(157,75,199,1) 11.2%, rgba(119,81,204,1) 83.1%)",
        opacity: 0.9,
      }}
      onClick={onClickConnectBtn}
    >
      <Icon as={icon ? icon : IoWallet} mr={2} />
      {buttonText ? buttonText : "Connect Wallet"}
    </Button>
  );
}; */

export const ConnectWalletButton = ({
  buttonText,
  buttonIcon,
  isLoading,
  isDisabled,
  onClickConnectBtn,
  icon,
  dataBsToggle,
  dataBsTarget,
  children,
}: ConnectWalletType) => {
  return !isLoading ? (
    dataBsToggle || dataBsTarget ? (
      <button
        type="button"
        className="button-secondary d-flex gap-1 align-items-center am-nav-item py-1 px-3 text-primary"
        data-bs-toggle={dataBsToggle}
        data-bs-target={dataBsTarget}
        disabled={isDisabled}
        onClick={onClickConnectBtn}
      >
        {icon && (
          <div
            className="position-relative rounded-circle"
            style={{ width: "23px", aspectRatio: "1/1" }}
          >
            <Image
              layout="fill"
              className="rounded-circle"
              src={icon}
              alt="#"
            />
          </div>
        )}
        {buttonIcon && <i className={`bi ${buttonIcon}`}></i>}
        {buttonText ? buttonText : "Connect Wallet"}
      </button>
    ) : (
      <div className="nav-item dropdown">
        <button
          type="button"
          className="button-secondary d-flex gap-2 align-items-center nav-link dropdown-toggle am-nav-item py-1 px-3 text-lowercase text-primary"
          data-bs-toggle="dropdown"
          aria-expanded="false"
          // disabled={isDisabled}
          onClick={onClickConnectBtn}
          id="navbarDropdown"
        >
          {icon && (
            <div
              className="position-relative rounded-circle"
              style={{ width: "23px", aspectRatio: "1/1" }}
            >
              <Image
                layout="fill"
                className="rounded-circle"
                src={icon}
                alt="#"
              />
            </div>
          )}
          {buttonIcon && <i className={`bi ${buttonIcon}`}></i>}
          {buttonText ? buttonText : "Connect Wallet"}
        </button>
        <div className="dropdown-menu">{children}</div>
      </div>
    )
  ) : (
    <button
      type="button"
      className="button-secondary d-flex gap-1 align-items-center am-nav-item py-1 px-3"
      disabled
    >
      <span
        className="spinner-grow spinner-grow-sm"
        role="status"
        aria-hidden="true"
      ></span>
      Loading...
    </button>
  );
};

export const Disconnected = ({
  buttonText,
  buttonIcon,
  onClick,
}: {
  buttonText: string;
  buttonIcon: string;
  onClick: MouseEventHandler<HTMLButtonElement>;
}) => {
  return (
    <ConnectWalletButton
      buttonText={buttonText}
      buttonIcon={buttonIcon}
      onClickConnectBtn={onClick}
    />
  );
};

export const Connected = ({
  buttonText,
  buttonIcon,
  icon,
  dataBsToggle,
  dataBsTarget,
  onClick,
  children,
}: {
  buttonText: string;
  buttonIcon: string;
  icon: string;
  dataBsToggle: string;
  dataBsTarget: string;
  onClick: MouseEventHandler<HTMLButtonElement>;
  children: HtmlProps;
}) => {
  return (
    <ConnectWalletButton
      buttonText={buttonText}
      buttonIcon={buttonIcon}
      icon={icon}
      dataBsToggle={dataBsToggle}
      dataBsTarget={dataBsTarget}
      onClickConnectBtn={onClick}
    >
      {children}
    </ConnectWalletButton>
  );
};

export const Connecting = () => {
  return <ConnectWalletButton isLoading={true} />;
};

export const Rejected = ({
  buttonText,
  wordOfWarning,
  onClick,
}: {
  buttonText: string;
  wordOfWarning?: string;
  onClick: MouseEventHandler<HTMLButtonElement>;
}) => {
  const bg = useColorModeValue("orange.200", "orange.300");

  return (
    <Stack>
      <ConnectWalletButton
        buttonText={buttonText}
        isDisabled={false}
        onClickConnectBtn={onClick}
      />
      {wordOfWarning && (
        <Stack
          isInline={true}
          borderRadius="md"
          bg={bg}
          color="blackAlpha.900"
          p={4}
          spacing={1}
        >
          <Icon as={FiAlertTriangle} mt={1} />
          <Text>
            <Text fontWeight="semibold" as="span">
              Warning:&ensp;
            </Text>
            {wordOfWarning}
          </Text>
        </Stack>
      )}
    </Stack>
  );
};

export const Error = ({
  buttonText,
  wordOfWarning,
  onClick,
}: {
  buttonText: string;
  wordOfWarning?: string;
  onClick: MouseEventHandler<HTMLButtonElement>;
}) => {
  const bg = useColorModeValue("orange.200", "orange.300");

  return (
    <Stack>
      <ConnectWalletButton
        buttonText={buttonText}
        isDisabled={false}
        onClickConnectBtn={onClick}
      />
      {wordOfWarning && (
        <Stack
          isInline={true}
          borderRadius="md"
          bg={bg}
          color="blackAlpha.900"
          p={4}
          spacing={1}
        >
          <Icon as={FiAlertTriangle} mt={1} />
          <Text>
            <Text fontWeight="semibold" as="span">
              Warning:&ensp;
            </Text>
            {wordOfWarning}
          </Text>
        </Stack>
      )}
    </Stack>
  );
};

export const NotExist = ({
  buttonText,
  onClick,
}: {
  buttonText: string;
  onClick: MouseEventHandler<HTMLButtonElement>;
}) => {
  return (
    <ConnectWalletButton
      buttonText={buttonText}
      isDisabled={false}
      onClickConnectBtn={onClick}
    />
  );
};

export const WalletConnectComponent = ({
  walletStatus,
  disconnect,
  connecting,
  connected,
  rejected,
  error,
  notExist,
}: {
  walletStatus: WalletStatus;
  disconnect: ReactNode;
  connecting: ReactNode;
  connected: ReactNode;
  rejected: ReactNode;
  error: ReactNode;
  notExist: ReactNode;
}) => {
  console.log("walletStatus: ", walletStatus);
  switch (walletStatus) {
    case WalletStatus.Disconnected:
      return <>{disconnect}</>;
    case WalletStatus.Connecting:
      return <>{connecting}</>;
    case WalletStatus.Connected:
      return <>{connected}</>;
    case WalletStatus.Rejected:
      return <>{rejected}</>;
    case WalletStatus.Error:
      return <>{error}</>;
    case WalletStatus.NotExist:
      return <>{notExist}</>;
    default:
      return <>{disconnect}</>;
  }
};
