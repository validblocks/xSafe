# @elrondnetwork/multisig

> An application that allows a user to create and manage multisig wallets on the MultiversX.

# Usage

This application can be started with a single multisig contract and
integrated into other applications as needed.

To configure the application to run for a specific contract with a specific alias as a name,
one has to edit the multisigConfig.ts file as follows:

```
export const uniqueContractAddress = 'your contract address';

export const uniqueContractName = 'contract user-friendly name';
```

Please bear in mind that the addres has to be a valid multisig address for the application to work.

## Roadmap

See the [open issues](https://github.com/ElrondNetwork/multisig/issues) for a list of proposed features (and known issues).

## Contributing

Contributions are what make the open source community such an amazing place to be learn, inspire, and create. Any contributions you make are **greatly appreciated**.

One can contribute by creating _pull requests_, or by opening _issues_ for discovered bugs or desired features.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## Developers

The [Elrond Team](https://elrond.com/team/).

## License

GPL-3.0-or-later
