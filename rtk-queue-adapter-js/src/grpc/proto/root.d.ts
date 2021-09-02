import * as $protobuf from "protobufjs";
/** Namespace wavesenterprise. */
export namespace wavesenterprise {

    /** Represents a BlockchainEventsService */
    class BlockchainEventsService extends $protobuf.rpc.Service {

        /**
         * Constructs a new BlockchainEventsService service.
         * @param rpcImpl RPC implementation
         * @param [requestDelimited=false] Whether requests are length-delimited
         * @param [responseDelimited=false] Whether responses are length-delimited
         */
        constructor(rpcImpl: $protobuf.RPCImpl, requestDelimited?: boolean, responseDelimited?: boolean);

        /**
         * Creates new BlockchainEventsService service using the specified rpc implementation.
         * @param rpcImpl RPC implementation
         * @param [requestDelimited=false] Whether requests are length-delimited
         * @param [responseDelimited=false] Whether responses are length-delimited
         * @returns RPC service. Useful where requests and/or responses are streamed.
         */
        public static create(rpcImpl: $protobuf.RPCImpl, requestDelimited?: boolean, responseDelimited?: boolean): BlockchainEventsService;

        /**
         * Calls SubscribeOn.
         * @param request SubscribeOnRequest message or plain object
         * @param callback Node-style callback called with the error, if any, and BlockchainEvent
         */
        public subscribeOn(request: wavesenterprise.ISubscribeOnRequest, callback: wavesenterprise.BlockchainEventsService.SubscribeOnCallback): void;

        /**
         * Calls SubscribeOn.
         * @param request SubscribeOnRequest message or plain object
         * @returns Promise
         */
        public subscribeOn(request: wavesenterprise.ISubscribeOnRequest): Promise<wavesenterprise.BlockchainEvent>;
    }

    namespace BlockchainEventsService {

        /**
         * Callback as used by {@link wavesenterprise.BlockchainEventsService#subscribeOn}.
         * @param error Error, if any
         * @param [response] BlockchainEvent
         */
        type SubscribeOnCallback = (error: (Error|null), response?: wavesenterprise.BlockchainEvent) => void;
    }

    /** Properties of a BlockchainEvent. */
    interface IBlockchainEvent {

        /** BlockchainEvent microBlockAppended */
        microBlockAppended?: (wavesenterprise.IMicroBlockAppended|null);

        /** BlockchainEvent blockAppended */
        blockAppended?: (wavesenterprise.IBlockAppended|null);

        /** BlockchainEvent rollbackCompleted */
        rollbackCompleted?: (wavesenterprise.IRollbackCompleted|null);

        /** BlockchainEvent appendedBlockHistory */
        appendedBlockHistory?: (wavesenterprise.IAppendedBlockHistory|null);
    }

    /** Represents a BlockchainEvent. */
    class BlockchainEvent implements IBlockchainEvent {

        /**
         * Constructs a new BlockchainEvent.
         * @param [properties] Properties to set
         */
        constructor(properties?: wavesenterprise.IBlockchainEvent);

        /** BlockchainEvent microBlockAppended. */
        public microBlockAppended?: (wavesenterprise.IMicroBlockAppended|null);

        /** BlockchainEvent blockAppended. */
        public blockAppended?: (wavesenterprise.IBlockAppended|null);

        /** BlockchainEvent rollbackCompleted. */
        public rollbackCompleted?: (wavesenterprise.IRollbackCompleted|null);

        /** BlockchainEvent appendedBlockHistory. */
        public appendedBlockHistory?: (wavesenterprise.IAppendedBlockHistory|null);

        /** BlockchainEvent blockchainEvent. */
        public blockchainEvent?: ("microBlockAppended"|"blockAppended"|"rollbackCompleted"|"appendedBlockHistory");

        /**
         * Creates a new BlockchainEvent instance using the specified properties.
         * @param [properties] Properties to set
         * @returns BlockchainEvent instance
         */
        public static create(properties?: wavesenterprise.IBlockchainEvent): wavesenterprise.BlockchainEvent;

        /**
         * Encodes the specified BlockchainEvent message. Does not implicitly {@link wavesenterprise.BlockchainEvent.verify|verify} messages.
         * @param message BlockchainEvent message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: wavesenterprise.IBlockchainEvent, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified BlockchainEvent message, length delimited. Does not implicitly {@link wavesenterprise.BlockchainEvent.verify|verify} messages.
         * @param message BlockchainEvent message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: wavesenterprise.IBlockchainEvent, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a BlockchainEvent message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns BlockchainEvent
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): wavesenterprise.BlockchainEvent;

        /**
         * Decodes a BlockchainEvent message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns BlockchainEvent
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): wavesenterprise.BlockchainEvent;

        /**
         * Verifies a BlockchainEvent message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a BlockchainEvent message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns BlockchainEvent
         */
        public static fromObject(object: { [k: string]: any }): wavesenterprise.BlockchainEvent;

        /**
         * Creates a plain object from a BlockchainEvent message. Also converts values to other types if specified.
         * @param message BlockchainEvent
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: wavesenterprise.BlockchainEvent, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this BlockchainEvent to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a GenericError. */
    interface IGenericError {
    }

    /** Represents a GenericError. */
    class GenericError implements IGenericError {

        /**
         * Constructs a new GenericError.
         * @param [properties] Properties to set
         */
        constructor(properties?: wavesenterprise.IGenericError);

        /**
         * Creates a new GenericError instance using the specified properties.
         * @param [properties] Properties to set
         * @returns GenericError instance
         */
        public static create(properties?: wavesenterprise.IGenericError): wavesenterprise.GenericError;

        /**
         * Encodes the specified GenericError message. Does not implicitly {@link wavesenterprise.GenericError.verify|verify} messages.
         * @param message GenericError message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: wavesenterprise.IGenericError, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified GenericError message, length delimited. Does not implicitly {@link wavesenterprise.GenericError.verify|verify} messages.
         * @param message GenericError message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: wavesenterprise.IGenericError, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a GenericError message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns GenericError
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): wavesenterprise.GenericError;

        /**
         * Decodes a GenericError message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns GenericError
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): wavesenterprise.GenericError;

        /**
         * Verifies a GenericError message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a GenericError message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns GenericError
         */
        public static fromObject(object: { [k: string]: any }): wavesenterprise.GenericError;

        /**
         * Creates a plain object from a GenericError message. Also converts values to other types if specified.
         * @param message GenericError
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: wavesenterprise.GenericError, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this GenericError to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a BlockSignatureNotFoundError. */
    interface IBlockSignatureNotFoundError {

        /** BlockSignatureNotFoundError blockSignature */
        blockSignature?: (Uint8Array|null);
    }

    /** Represents a BlockSignatureNotFoundError. */
    class BlockSignatureNotFoundError implements IBlockSignatureNotFoundError {

        /**
         * Constructs a new BlockSignatureNotFoundError.
         * @param [properties] Properties to set
         */
        constructor(properties?: wavesenterprise.IBlockSignatureNotFoundError);

        /** BlockSignatureNotFoundError blockSignature. */
        public blockSignature: Uint8Array;

        /**
         * Creates a new BlockSignatureNotFoundError instance using the specified properties.
         * @param [properties] Properties to set
         * @returns BlockSignatureNotFoundError instance
         */
        public static create(properties?: wavesenterprise.IBlockSignatureNotFoundError): wavesenterprise.BlockSignatureNotFoundError;

        /**
         * Encodes the specified BlockSignatureNotFoundError message. Does not implicitly {@link wavesenterprise.BlockSignatureNotFoundError.verify|verify} messages.
         * @param message BlockSignatureNotFoundError message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: wavesenterprise.IBlockSignatureNotFoundError, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified BlockSignatureNotFoundError message, length delimited. Does not implicitly {@link wavesenterprise.BlockSignatureNotFoundError.verify|verify} messages.
         * @param message BlockSignatureNotFoundError message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: wavesenterprise.IBlockSignatureNotFoundError, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a BlockSignatureNotFoundError message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns BlockSignatureNotFoundError
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): wavesenterprise.BlockSignatureNotFoundError;

        /**
         * Decodes a BlockSignatureNotFoundError message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns BlockSignatureNotFoundError
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): wavesenterprise.BlockSignatureNotFoundError;

        /**
         * Verifies a BlockSignatureNotFoundError message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a BlockSignatureNotFoundError message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns BlockSignatureNotFoundError
         */
        public static fromObject(object: { [k: string]: any }): wavesenterprise.BlockSignatureNotFoundError;

        /**
         * Creates a plain object from a BlockSignatureNotFoundError message. Also converts values to other types if specified.
         * @param message BlockSignatureNotFoundError
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: wavesenterprise.BlockSignatureNotFoundError, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this BlockSignatureNotFoundError to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a MissingRequiredRequestField. */
    interface IMissingRequiredRequestField {
    }

    /** Represents a MissingRequiredRequestField. */
    class MissingRequiredRequestField implements IMissingRequiredRequestField {

        /**
         * Constructs a new MissingRequiredRequestField.
         * @param [properties] Properties to set
         */
        constructor(properties?: wavesenterprise.IMissingRequiredRequestField);

        /**
         * Creates a new MissingRequiredRequestField instance using the specified properties.
         * @param [properties] Properties to set
         * @returns MissingRequiredRequestField instance
         */
        public static create(properties?: wavesenterprise.IMissingRequiredRequestField): wavesenterprise.MissingRequiredRequestField;

        /**
         * Encodes the specified MissingRequiredRequestField message. Does not implicitly {@link wavesenterprise.MissingRequiredRequestField.verify|verify} messages.
         * @param message MissingRequiredRequestField message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: wavesenterprise.IMissingRequiredRequestField, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified MissingRequiredRequestField message, length delimited. Does not implicitly {@link wavesenterprise.MissingRequiredRequestField.verify|verify} messages.
         * @param message MissingRequiredRequestField message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: wavesenterprise.IMissingRequiredRequestField, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a MissingRequiredRequestField message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns MissingRequiredRequestField
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): wavesenterprise.MissingRequiredRequestField;

        /**
         * Decodes a MissingRequiredRequestField message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns MissingRequiredRequestField
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): wavesenterprise.MissingRequiredRequestField;

        /**
         * Verifies a MissingRequiredRequestField message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a MissingRequiredRequestField message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns MissingRequiredRequestField
         */
        public static fromObject(object: { [k: string]: any }): wavesenterprise.MissingRequiredRequestField;

        /**
         * Creates a plain object from a MissingRequiredRequestField message. Also converts values to other types if specified.
         * @param message MissingRequiredRequestField
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: wavesenterprise.MissingRequiredRequestField, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this MissingRequiredRequestField to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a MissingAuthorizationMetadata. */
    interface IMissingAuthorizationMetadata {
    }

    /** Represents a MissingAuthorizationMetadata. */
    class MissingAuthorizationMetadata implements IMissingAuthorizationMetadata {

        /**
         * Constructs a new MissingAuthorizationMetadata.
         * @param [properties] Properties to set
         */
        constructor(properties?: wavesenterprise.IMissingAuthorizationMetadata);

        /**
         * Creates a new MissingAuthorizationMetadata instance using the specified properties.
         * @param [properties] Properties to set
         * @returns MissingAuthorizationMetadata instance
         */
        public static create(properties?: wavesenterprise.IMissingAuthorizationMetadata): wavesenterprise.MissingAuthorizationMetadata;

        /**
         * Encodes the specified MissingAuthorizationMetadata message. Does not implicitly {@link wavesenterprise.MissingAuthorizationMetadata.verify|verify} messages.
         * @param message MissingAuthorizationMetadata message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: wavesenterprise.IMissingAuthorizationMetadata, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified MissingAuthorizationMetadata message, length delimited. Does not implicitly {@link wavesenterprise.MissingAuthorizationMetadata.verify|verify} messages.
         * @param message MissingAuthorizationMetadata message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: wavesenterprise.IMissingAuthorizationMetadata, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a MissingAuthorizationMetadata message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns MissingAuthorizationMetadata
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): wavesenterprise.MissingAuthorizationMetadata;

        /**
         * Decodes a MissingAuthorizationMetadata message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns MissingAuthorizationMetadata
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): wavesenterprise.MissingAuthorizationMetadata;

        /**
         * Verifies a MissingAuthorizationMetadata message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a MissingAuthorizationMetadata message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns MissingAuthorizationMetadata
         */
        public static fromObject(object: { [k: string]: any }): wavesenterprise.MissingAuthorizationMetadata;

        /**
         * Creates a plain object from a MissingAuthorizationMetadata message. Also converts values to other types if specified.
         * @param message MissingAuthorizationMetadata
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: wavesenterprise.MissingAuthorizationMetadata, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this MissingAuthorizationMetadata to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of an InvalidApiKey. */
    interface IInvalidApiKey {
    }

    /** Represents an InvalidApiKey. */
    class InvalidApiKey implements IInvalidApiKey {

        /**
         * Constructs a new InvalidApiKey.
         * @param [properties] Properties to set
         */
        constructor(properties?: wavesenterprise.IInvalidApiKey);

        /**
         * Creates a new InvalidApiKey instance using the specified properties.
         * @param [properties] Properties to set
         * @returns InvalidApiKey instance
         */
        public static create(properties?: wavesenterprise.IInvalidApiKey): wavesenterprise.InvalidApiKey;

        /**
         * Encodes the specified InvalidApiKey message. Does not implicitly {@link wavesenterprise.InvalidApiKey.verify|verify} messages.
         * @param message InvalidApiKey message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: wavesenterprise.IInvalidApiKey, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified InvalidApiKey message, length delimited. Does not implicitly {@link wavesenterprise.InvalidApiKey.verify|verify} messages.
         * @param message InvalidApiKey message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: wavesenterprise.IInvalidApiKey, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes an InvalidApiKey message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns InvalidApiKey
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): wavesenterprise.InvalidApiKey;

        /**
         * Decodes an InvalidApiKey message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns InvalidApiKey
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): wavesenterprise.InvalidApiKey;

        /**
         * Verifies an InvalidApiKey message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates an InvalidApiKey message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns InvalidApiKey
         */
        public static fromObject(object: { [k: string]: any }): wavesenterprise.InvalidApiKey;

        /**
         * Creates a plain object from an InvalidApiKey message. Also converts values to other types if specified.
         * @param message InvalidApiKey
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: wavesenterprise.InvalidApiKey, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this InvalidApiKey to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of an InvalidToken. */
    interface IInvalidToken {
    }

    /** Represents an InvalidToken. */
    class InvalidToken implements IInvalidToken {

        /**
         * Constructs a new InvalidToken.
         * @param [properties] Properties to set
         */
        constructor(properties?: wavesenterprise.IInvalidToken);

        /**
         * Creates a new InvalidToken instance using the specified properties.
         * @param [properties] Properties to set
         * @returns InvalidToken instance
         */
        public static create(properties?: wavesenterprise.IInvalidToken): wavesenterprise.InvalidToken;

        /**
         * Encodes the specified InvalidToken message. Does not implicitly {@link wavesenterprise.InvalidToken.verify|verify} messages.
         * @param message InvalidToken message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: wavesenterprise.IInvalidToken, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified InvalidToken message, length delimited. Does not implicitly {@link wavesenterprise.InvalidToken.verify|verify} messages.
         * @param message InvalidToken message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: wavesenterprise.IInvalidToken, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes an InvalidToken message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns InvalidToken
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): wavesenterprise.InvalidToken;

        /**
         * Decodes an InvalidToken message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns InvalidToken
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): wavesenterprise.InvalidToken;

        /**
         * Verifies an InvalidToken message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates an InvalidToken message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns InvalidToken
         */
        public static fromObject(object: { [k: string]: any }): wavesenterprise.InvalidToken;

        /**
         * Creates a plain object from an InvalidToken message. Also converts values to other types if specified.
         * @param message InvalidToken
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: wavesenterprise.InvalidToken, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this InvalidToken to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a MicroBlockAppended. */
    interface IMicroBlockAppended {

        /** MicroBlockAppended txs */
        txs?: (wavesenterprise.ITransaction[]|null);
    }

    /** Represents a MicroBlockAppended. */
    class MicroBlockAppended implements IMicroBlockAppended {

        /**
         * Constructs a new MicroBlockAppended.
         * @param [properties] Properties to set
         */
        constructor(properties?: wavesenterprise.IMicroBlockAppended);

        /** MicroBlockAppended txs. */
        public txs: wavesenterprise.ITransaction[];

        /**
         * Creates a new MicroBlockAppended instance using the specified properties.
         * @param [properties] Properties to set
         * @returns MicroBlockAppended instance
         */
        public static create(properties?: wavesenterprise.IMicroBlockAppended): wavesenterprise.MicroBlockAppended;

        /**
         * Encodes the specified MicroBlockAppended message. Does not implicitly {@link wavesenterprise.MicroBlockAppended.verify|verify} messages.
         * @param message MicroBlockAppended message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: wavesenterprise.IMicroBlockAppended, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified MicroBlockAppended message, length delimited. Does not implicitly {@link wavesenterprise.MicroBlockAppended.verify|verify} messages.
         * @param message MicroBlockAppended message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: wavesenterprise.IMicroBlockAppended, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a MicroBlockAppended message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns MicroBlockAppended
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): wavesenterprise.MicroBlockAppended;

        /**
         * Decodes a MicroBlockAppended message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns MicroBlockAppended
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): wavesenterprise.MicroBlockAppended;

        /**
         * Verifies a MicroBlockAppended message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a MicroBlockAppended message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns MicroBlockAppended
         */
        public static fromObject(object: { [k: string]: any }): wavesenterprise.MicroBlockAppended;

        /**
         * Creates a plain object from a MicroBlockAppended message. Also converts values to other types if specified.
         * @param message MicroBlockAppended
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: wavesenterprise.MicroBlockAppended, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this MicroBlockAppended to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a BlockAppended. */
    interface IBlockAppended {

        /** BlockAppended blockSignature */
        blockSignature?: (Uint8Array|null);

        /** BlockAppended reference */
        reference?: (Uint8Array|null);

        /** BlockAppended txIds */
        txIds?: (Uint8Array[]|null);

        /** BlockAppended minerAddress */
        minerAddress?: (Uint8Array|null);

        /** BlockAppended height */
        height?: (number|Long|null);

        /** BlockAppended version */
        version?: (number|null);

        /** BlockAppended timestamp */
        timestamp?: (number|Long|null);

        /** BlockAppended fee */
        fee?: (number|Long|null);

        /** BlockAppended blockSize */
        blockSize?: (number|null);

        /** BlockAppended features */
        features?: (number[]|null);
    }

    /** Represents a BlockAppended. */
    class BlockAppended implements IBlockAppended {

        /**
         * Constructs a new BlockAppended.
         * @param [properties] Properties to set
         */
        constructor(properties?: wavesenterprise.IBlockAppended);

        /** BlockAppended blockSignature. */
        public blockSignature: Uint8Array;

        /** BlockAppended reference. */
        public reference: Uint8Array;

        /** BlockAppended txIds. */
        public txIds: Uint8Array[];

        /** BlockAppended minerAddress. */
        public minerAddress: Uint8Array;

        /** BlockAppended height. */
        public height: (number|Long);

        /** BlockAppended version. */
        public version: number;

        /** BlockAppended timestamp. */
        public timestamp: (number|Long);

        /** BlockAppended fee. */
        public fee: (number|Long);

        /** BlockAppended blockSize. */
        public blockSize: number;

        /** BlockAppended features. */
        public features: number[];

        /**
         * Creates a new BlockAppended instance using the specified properties.
         * @param [properties] Properties to set
         * @returns BlockAppended instance
         */
        public static create(properties?: wavesenterprise.IBlockAppended): wavesenterprise.BlockAppended;

        /**
         * Encodes the specified BlockAppended message. Does not implicitly {@link wavesenterprise.BlockAppended.verify|verify} messages.
         * @param message BlockAppended message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: wavesenterprise.IBlockAppended, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified BlockAppended message, length delimited. Does not implicitly {@link wavesenterprise.BlockAppended.verify|verify} messages.
         * @param message BlockAppended message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: wavesenterprise.IBlockAppended, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a BlockAppended message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns BlockAppended
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): wavesenterprise.BlockAppended;

        /**
         * Decodes a BlockAppended message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns BlockAppended
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): wavesenterprise.BlockAppended;

        /**
         * Verifies a BlockAppended message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a BlockAppended message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns BlockAppended
         */
        public static fromObject(object: { [k: string]: any }): wavesenterprise.BlockAppended;

        /**
         * Creates a plain object from a BlockAppended message. Also converts values to other types if specified.
         * @param message BlockAppended
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: wavesenterprise.BlockAppended, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this BlockAppended to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a RollbackCompleted. */
    interface IRollbackCompleted {

        /** RollbackCompleted returnToBlockSignature */
        returnToBlockSignature?: (Uint8Array|null);

        /** RollbackCompleted rollbackTxIds */
        rollbackTxIds?: (Uint8Array[]|null);
    }

    /** Represents a RollbackCompleted. */
    class RollbackCompleted implements IRollbackCompleted {

        /**
         * Constructs a new RollbackCompleted.
         * @param [properties] Properties to set
         */
        constructor(properties?: wavesenterprise.IRollbackCompleted);

        /** RollbackCompleted returnToBlockSignature. */
        public returnToBlockSignature: Uint8Array;

        /** RollbackCompleted rollbackTxIds. */
        public rollbackTxIds: Uint8Array[];

        /**
         * Creates a new RollbackCompleted instance using the specified properties.
         * @param [properties] Properties to set
         * @returns RollbackCompleted instance
         */
        public static create(properties?: wavesenterprise.IRollbackCompleted): wavesenterprise.RollbackCompleted;

        /**
         * Encodes the specified RollbackCompleted message. Does not implicitly {@link wavesenterprise.RollbackCompleted.verify|verify} messages.
         * @param message RollbackCompleted message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: wavesenterprise.IRollbackCompleted, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified RollbackCompleted message, length delimited. Does not implicitly {@link wavesenterprise.RollbackCompleted.verify|verify} messages.
         * @param message RollbackCompleted message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: wavesenterprise.IRollbackCompleted, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a RollbackCompleted message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns RollbackCompleted
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): wavesenterprise.RollbackCompleted;

        /**
         * Decodes a RollbackCompleted message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns RollbackCompleted
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): wavesenterprise.RollbackCompleted;

        /**
         * Verifies a RollbackCompleted message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a RollbackCompleted message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns RollbackCompleted
         */
        public static fromObject(object: { [k: string]: any }): wavesenterprise.RollbackCompleted;

        /**
         * Creates a plain object from a RollbackCompleted message. Also converts values to other types if specified.
         * @param message RollbackCompleted
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: wavesenterprise.RollbackCompleted, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this RollbackCompleted to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of an AppendedBlockHistory. */
    interface IAppendedBlockHistory {

        /** AppendedBlockHistory blockSignature */
        blockSignature?: (Uint8Array|null);

        /** AppendedBlockHistory reference */
        reference?: (Uint8Array|null);

        /** AppendedBlockHistory txs */
        txs?: (wavesenterprise.ITransaction[]|null);

        /** AppendedBlockHistory minerAddress */
        minerAddress?: (Uint8Array|null);

        /** AppendedBlockHistory height */
        height?: (number|Long|null);

        /** AppendedBlockHistory version */
        version?: (number|null);

        /** AppendedBlockHistory timestamp */
        timestamp?: (number|Long|null);

        /** AppendedBlockHistory fee */
        fee?: (number|Long|null);

        /** AppendedBlockHistory blockSize */
        blockSize?: (number|null);

        /** AppendedBlockHistory features */
        features?: (number[]|null);
    }

    /** Represents an AppendedBlockHistory. */
    class AppendedBlockHistory implements IAppendedBlockHistory {

        /**
         * Constructs a new AppendedBlockHistory.
         * @param [properties] Properties to set
         */
        constructor(properties?: wavesenterprise.IAppendedBlockHistory);

        /** AppendedBlockHistory blockSignature. */
        public blockSignature: Uint8Array;

        /** AppendedBlockHistory reference. */
        public reference: Uint8Array;

        /** AppendedBlockHistory txs. */
        public txs: wavesenterprise.ITransaction[];

        /** AppendedBlockHistory minerAddress. */
        public minerAddress: Uint8Array;

        /** AppendedBlockHistory height. */
        public height: (number|Long);

        /** AppendedBlockHistory version. */
        public version: number;

        /** AppendedBlockHistory timestamp. */
        public timestamp: (number|Long);

        /** AppendedBlockHistory fee. */
        public fee: (number|Long);

        /** AppendedBlockHistory blockSize. */
        public blockSize: number;

        /** AppendedBlockHistory features. */
        public features: number[];

        /**
         * Creates a new AppendedBlockHistory instance using the specified properties.
         * @param [properties] Properties to set
         * @returns AppendedBlockHistory instance
         */
        public static create(properties?: wavesenterprise.IAppendedBlockHistory): wavesenterprise.AppendedBlockHistory;

        /**
         * Encodes the specified AppendedBlockHistory message. Does not implicitly {@link wavesenterprise.AppendedBlockHistory.verify|verify} messages.
         * @param message AppendedBlockHistory message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: wavesenterprise.IAppendedBlockHistory, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified AppendedBlockHistory message, length delimited. Does not implicitly {@link wavesenterprise.AppendedBlockHistory.verify|verify} messages.
         * @param message AppendedBlockHistory message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: wavesenterprise.IAppendedBlockHistory, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes an AppendedBlockHistory message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns AppendedBlockHistory
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): wavesenterprise.AppendedBlockHistory;

        /**
         * Decodes an AppendedBlockHistory message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns AppendedBlockHistory
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): wavesenterprise.AppendedBlockHistory;

        /**
         * Verifies an AppendedBlockHistory message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates an AppendedBlockHistory message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns AppendedBlockHistory
         */
        public static fromObject(object: { [k: string]: any }): wavesenterprise.AppendedBlockHistory;

        /**
         * Creates a plain object from an AppendedBlockHistory message. Also converts values to other types if specified.
         * @param message AppendedBlockHistory
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: wavesenterprise.AppendedBlockHistory, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this AppendedBlockHistory to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a Transaction. */
    interface ITransaction {

        /** Transaction version */
        version?: (number|null);

        /** Transaction genesisTransaction */
        genesisTransaction?: (wavesenterprise.IGenesisTransaction|null);

        /** Transaction genesisPermitTransaction */
        genesisPermitTransaction?: (wavesenterprise.IGenesisPermitTransaction|null);

        /** Transaction genesisRegisterNodeTransaction */
        genesisRegisterNodeTransaction?: (wavesenterprise.IGenesisRegisterNodeTransaction|null);

        /** Transaction registerNodeTransaction */
        registerNodeTransaction?: (wavesenterprise.IRegisterNodeTransaction|null);

        /** Transaction createAliasTransaction */
        createAliasTransaction?: (wavesenterprise.ICreateAliasTransaction|null);

        /** Transaction issueTransaction */
        issueTransaction?: (wavesenterprise.IIssueTransaction|null);

        /** Transaction reissueTransaction */
        reissueTransaction?: (wavesenterprise.IReissueTransaction|null);

        /** Transaction burnTransaction */
        burnTransaction?: (wavesenterprise.IBurnTransaction|null);

        /** Transaction leaseTransaction */
        leaseTransaction?: (wavesenterprise.ILeaseTransaction|null);

        /** Transaction leaseCancelTransaction */
        leaseCancelTransaction?: (wavesenterprise.ILeaseCancelTransaction|null);

        /** Transaction sponsorFeeTransaction */
        sponsorFeeTransaction?: (wavesenterprise.ISponsorFeeTransaction|null);

        /** Transaction setAssetScriptTransaction */
        setAssetScriptTransaction?: (wavesenterprise.ISetAssetScriptTransaction|null);

        /** Transaction dataTransaction */
        dataTransaction?: (wavesenterprise.IDataTransaction|null);

        /** Transaction transferTransaction */
        transferTransaction?: (wavesenterprise.ITransferTransaction|null);

        /** Transaction massTransferTransaction */
        massTransferTransaction?: (wavesenterprise.IMassTransferTransaction|null);

        /** Transaction permitTransaction */
        permitTransaction?: (wavesenterprise.IPermitTransaction|null);

        /** Transaction createPolicyTransaction */
        createPolicyTransaction?: (wavesenterprise.ICreatePolicyTransaction|null);

        /** Transaction updatePolicyTransaction */
        updatePolicyTransaction?: (wavesenterprise.IUpdatePolicyTransaction|null);

        /** Transaction policyDataHashTransaction */
        policyDataHashTransaction?: (wavesenterprise.IPolicyDataHashTransaction|null);

        /** Transaction createContractTransaction */
        createContractTransaction?: (wavesenterprise.ICreateContractTransaction|null);

        /** Transaction callContractTransaction */
        callContractTransaction?: (wavesenterprise.ICallContractTransaction|null);

        /** Transaction executedContractTransaction */
        executedContractTransaction?: (wavesenterprise.IExecutedContractTransaction|null);

        /** Transaction disableContractTransaction */
        disableContractTransaction?: (wavesenterprise.IDisableContractTransaction|null);

        /** Transaction updateContractTransaction */
        updateContractTransaction?: (wavesenterprise.IUpdateContractTransaction|null);

        /** Transaction setScriptTransaction */
        setScriptTransaction?: (wavesenterprise.ISetScriptTransaction|null);

        /** Transaction atomicTransaction */
        atomicTransaction?: (wavesenterprise.IAtomicTransaction|null);
    }

    /** Represents a Transaction. */
    class Transaction implements ITransaction {

        /**
         * Constructs a new Transaction.
         * @param [properties] Properties to set
         */
        constructor(properties?: wavesenterprise.ITransaction);

        /** Transaction version. */
        public version: number;

        /** Transaction genesisTransaction. */
        public genesisTransaction?: (wavesenterprise.IGenesisTransaction|null);

        /** Transaction genesisPermitTransaction. */
        public genesisPermitTransaction?: (wavesenterprise.IGenesisPermitTransaction|null);

        /** Transaction genesisRegisterNodeTransaction. */
        public genesisRegisterNodeTransaction?: (wavesenterprise.IGenesisRegisterNodeTransaction|null);

        /** Transaction registerNodeTransaction. */
        public registerNodeTransaction?: (wavesenterprise.IRegisterNodeTransaction|null);

        /** Transaction createAliasTransaction. */
        public createAliasTransaction?: (wavesenterprise.ICreateAliasTransaction|null);

        /** Transaction issueTransaction. */
        public issueTransaction?: (wavesenterprise.IIssueTransaction|null);

        /** Transaction reissueTransaction. */
        public reissueTransaction?: (wavesenterprise.IReissueTransaction|null);

        /** Transaction burnTransaction. */
        public burnTransaction?: (wavesenterprise.IBurnTransaction|null);

        /** Transaction leaseTransaction. */
        public leaseTransaction?: (wavesenterprise.ILeaseTransaction|null);

        /** Transaction leaseCancelTransaction. */
        public leaseCancelTransaction?: (wavesenterprise.ILeaseCancelTransaction|null);

        /** Transaction sponsorFeeTransaction. */
        public sponsorFeeTransaction?: (wavesenterprise.ISponsorFeeTransaction|null);

        /** Transaction setAssetScriptTransaction. */
        public setAssetScriptTransaction?: (wavesenterprise.ISetAssetScriptTransaction|null);

        /** Transaction dataTransaction. */
        public dataTransaction?: (wavesenterprise.IDataTransaction|null);

        /** Transaction transferTransaction. */
        public transferTransaction?: (wavesenterprise.ITransferTransaction|null);

        /** Transaction massTransferTransaction. */
        public massTransferTransaction?: (wavesenterprise.IMassTransferTransaction|null);

        /** Transaction permitTransaction. */
        public permitTransaction?: (wavesenterprise.IPermitTransaction|null);

        /** Transaction createPolicyTransaction. */
        public createPolicyTransaction?: (wavesenterprise.ICreatePolicyTransaction|null);

        /** Transaction updatePolicyTransaction. */
        public updatePolicyTransaction?: (wavesenterprise.IUpdatePolicyTransaction|null);

        /** Transaction policyDataHashTransaction. */
        public policyDataHashTransaction?: (wavesenterprise.IPolicyDataHashTransaction|null);

        /** Transaction createContractTransaction. */
        public createContractTransaction?: (wavesenterprise.ICreateContractTransaction|null);

        /** Transaction callContractTransaction. */
        public callContractTransaction?: (wavesenterprise.ICallContractTransaction|null);

        /** Transaction executedContractTransaction. */
        public executedContractTransaction?: (wavesenterprise.IExecutedContractTransaction|null);

        /** Transaction disableContractTransaction. */
        public disableContractTransaction?: (wavesenterprise.IDisableContractTransaction|null);

        /** Transaction updateContractTransaction. */
        public updateContractTransaction?: (wavesenterprise.IUpdateContractTransaction|null);

        /** Transaction setScriptTransaction. */
        public setScriptTransaction?: (wavesenterprise.ISetScriptTransaction|null);

        /** Transaction atomicTransaction. */
        public atomicTransaction?: (wavesenterprise.IAtomicTransaction|null);

        /** Transaction transaction. */
        public transaction?: ("genesisTransaction"|"genesisPermitTransaction"|"genesisRegisterNodeTransaction"|"registerNodeTransaction"|"createAliasTransaction"|"issueTransaction"|"reissueTransaction"|"burnTransaction"|"leaseTransaction"|"leaseCancelTransaction"|"sponsorFeeTransaction"|"setAssetScriptTransaction"|"dataTransaction"|"transferTransaction"|"massTransferTransaction"|"permitTransaction"|"createPolicyTransaction"|"updatePolicyTransaction"|"policyDataHashTransaction"|"createContractTransaction"|"callContractTransaction"|"executedContractTransaction"|"disableContractTransaction"|"updateContractTransaction"|"setScriptTransaction"|"atomicTransaction");

        /**
         * Creates a new Transaction instance using the specified properties.
         * @param [properties] Properties to set
         * @returns Transaction instance
         */
        public static create(properties?: wavesenterprise.ITransaction): wavesenterprise.Transaction;

        /**
         * Encodes the specified Transaction message. Does not implicitly {@link wavesenterprise.Transaction.verify|verify} messages.
         * @param message Transaction message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: wavesenterprise.ITransaction, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified Transaction message, length delimited. Does not implicitly {@link wavesenterprise.Transaction.verify|verify} messages.
         * @param message Transaction message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: wavesenterprise.ITransaction, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a Transaction message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns Transaction
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): wavesenterprise.Transaction;

        /**
         * Decodes a Transaction message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns Transaction
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): wavesenterprise.Transaction;

        /**
         * Verifies a Transaction message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a Transaction message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns Transaction
         */
        public static fromObject(object: { [k: string]: any }): wavesenterprise.Transaction;

        /**
         * Creates a plain object from a Transaction message. Also converts values to other types if specified.
         * @param message Transaction
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: wavesenterprise.Transaction, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this Transaction to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a GenesisTransaction. */
    interface IGenesisTransaction {

        /** GenesisTransaction id */
        id?: (Uint8Array|null);

        /** GenesisTransaction recipient */
        recipient?: (Uint8Array|null);

        /** GenesisTransaction amount */
        amount?: (number|Long|null);

        /** GenesisTransaction fee */
        fee?: (number|Long|null);

        /** GenesisTransaction timestamp */
        timestamp?: (number|Long|null);

        /** GenesisTransaction signature */
        signature?: (Uint8Array|null);
    }

    /** Represents a GenesisTransaction. */
    class GenesisTransaction implements IGenesisTransaction {

        /**
         * Constructs a new GenesisTransaction.
         * @param [properties] Properties to set
         */
        constructor(properties?: wavesenterprise.IGenesisTransaction);

        /** GenesisTransaction id. */
        public id: Uint8Array;

        /** GenesisTransaction recipient. */
        public recipient: Uint8Array;

        /** GenesisTransaction amount. */
        public amount: (number|Long);

        /** GenesisTransaction fee. */
        public fee: (number|Long);

        /** GenesisTransaction timestamp. */
        public timestamp: (number|Long);

        /** GenesisTransaction signature. */
        public signature: Uint8Array;

        /**
         * Creates a new GenesisTransaction instance using the specified properties.
         * @param [properties] Properties to set
         * @returns GenesisTransaction instance
         */
        public static create(properties?: wavesenterprise.IGenesisTransaction): wavesenterprise.GenesisTransaction;

        /**
         * Encodes the specified GenesisTransaction message. Does not implicitly {@link wavesenterprise.GenesisTransaction.verify|verify} messages.
         * @param message GenesisTransaction message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: wavesenterprise.IGenesisTransaction, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified GenesisTransaction message, length delimited. Does not implicitly {@link wavesenterprise.GenesisTransaction.verify|verify} messages.
         * @param message GenesisTransaction message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: wavesenterprise.IGenesisTransaction, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a GenesisTransaction message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns GenesisTransaction
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): wavesenterprise.GenesisTransaction;

        /**
         * Decodes a GenesisTransaction message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns GenesisTransaction
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): wavesenterprise.GenesisTransaction;

        /**
         * Verifies a GenesisTransaction message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a GenesisTransaction message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns GenesisTransaction
         */
        public static fromObject(object: { [k: string]: any }): wavesenterprise.GenesisTransaction;

        /**
         * Creates a plain object from a GenesisTransaction message. Also converts values to other types if specified.
         * @param message GenesisTransaction
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: wavesenterprise.GenesisTransaction, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this GenesisTransaction to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a GenesisPermitTransaction. */
    interface IGenesisPermitTransaction {

        /** GenesisPermitTransaction id */
        id?: (Uint8Array|null);

        /** GenesisPermitTransaction target */
        target?: (Uint8Array|null);

        /** GenesisPermitTransaction role */
        role?: (wavesenterprise.IRole|null);

        /** GenesisPermitTransaction fee */
        fee?: (number|Long|null);

        /** GenesisPermitTransaction timestamp */
        timestamp?: (number|Long|null);

        /** GenesisPermitTransaction signature */
        signature?: (Uint8Array|null);
    }

    /** Represents a GenesisPermitTransaction. */
    class GenesisPermitTransaction implements IGenesisPermitTransaction {

        /**
         * Constructs a new GenesisPermitTransaction.
         * @param [properties] Properties to set
         */
        constructor(properties?: wavesenterprise.IGenesisPermitTransaction);

        /** GenesisPermitTransaction id. */
        public id: Uint8Array;

        /** GenesisPermitTransaction target. */
        public target: Uint8Array;

        /** GenesisPermitTransaction role. */
        public role?: (wavesenterprise.IRole|null);

        /** GenesisPermitTransaction fee. */
        public fee: (number|Long);

        /** GenesisPermitTransaction timestamp. */
        public timestamp: (number|Long);

        /** GenesisPermitTransaction signature. */
        public signature: Uint8Array;

        /**
         * Creates a new GenesisPermitTransaction instance using the specified properties.
         * @param [properties] Properties to set
         * @returns GenesisPermitTransaction instance
         */
        public static create(properties?: wavesenterprise.IGenesisPermitTransaction): wavesenterprise.GenesisPermitTransaction;

        /**
         * Encodes the specified GenesisPermitTransaction message. Does not implicitly {@link wavesenterprise.GenesisPermitTransaction.verify|verify} messages.
         * @param message GenesisPermitTransaction message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: wavesenterprise.IGenesisPermitTransaction, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified GenesisPermitTransaction message, length delimited. Does not implicitly {@link wavesenterprise.GenesisPermitTransaction.verify|verify} messages.
         * @param message GenesisPermitTransaction message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: wavesenterprise.IGenesisPermitTransaction, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a GenesisPermitTransaction message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns GenesisPermitTransaction
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): wavesenterprise.GenesisPermitTransaction;

        /**
         * Decodes a GenesisPermitTransaction message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns GenesisPermitTransaction
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): wavesenterprise.GenesisPermitTransaction;

        /**
         * Verifies a GenesisPermitTransaction message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a GenesisPermitTransaction message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns GenesisPermitTransaction
         */
        public static fromObject(object: { [k: string]: any }): wavesenterprise.GenesisPermitTransaction;

        /**
         * Creates a plain object from a GenesisPermitTransaction message. Also converts values to other types if specified.
         * @param message GenesisPermitTransaction
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: wavesenterprise.GenesisPermitTransaction, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this GenesisPermitTransaction to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a Role. */
    interface IRole {

        /** Role id */
        id?: (number|null);
    }

    /** Represents a Role. */
    class Role implements IRole {

        /**
         * Constructs a new Role.
         * @param [properties] Properties to set
         */
        constructor(properties?: wavesenterprise.IRole);

        /** Role id. */
        public id: number;

        /**
         * Creates a new Role instance using the specified properties.
         * @param [properties] Properties to set
         * @returns Role instance
         */
        public static create(properties?: wavesenterprise.IRole): wavesenterprise.Role;

        /**
         * Encodes the specified Role message. Does not implicitly {@link wavesenterprise.Role.verify|verify} messages.
         * @param message Role message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: wavesenterprise.IRole, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified Role message, length delimited. Does not implicitly {@link wavesenterprise.Role.verify|verify} messages.
         * @param message Role message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: wavesenterprise.IRole, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a Role message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns Role
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): wavesenterprise.Role;

        /**
         * Decodes a Role message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns Role
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): wavesenterprise.Role;

        /**
         * Verifies a Role message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a Role message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns Role
         */
        public static fromObject(object: { [k: string]: any }): wavesenterprise.Role;

        /**
         * Creates a plain object from a Role message. Also converts values to other types if specified.
         * @param message Role
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: wavesenterprise.Role, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this Role to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a GenesisRegisterNodeTransaction. */
    interface IGenesisRegisterNodeTransaction {

        /** GenesisRegisterNodeTransaction id */
        id?: (Uint8Array|null);

        /** GenesisRegisterNodeTransaction targetPublicKey */
        targetPublicKey?: (Uint8Array|null);

        /** GenesisRegisterNodeTransaction fee */
        fee?: (number|Long|null);

        /** GenesisRegisterNodeTransaction timestamp */
        timestamp?: (number|Long|null);

        /** GenesisRegisterNodeTransaction signature */
        signature?: (Uint8Array|null);
    }

    /** Represents a GenesisRegisterNodeTransaction. */
    class GenesisRegisterNodeTransaction implements IGenesisRegisterNodeTransaction {

        /**
         * Constructs a new GenesisRegisterNodeTransaction.
         * @param [properties] Properties to set
         */
        constructor(properties?: wavesenterprise.IGenesisRegisterNodeTransaction);

        /** GenesisRegisterNodeTransaction id. */
        public id: Uint8Array;

        /** GenesisRegisterNodeTransaction targetPublicKey. */
        public targetPublicKey: Uint8Array;

        /** GenesisRegisterNodeTransaction fee. */
        public fee: (number|Long);

        /** GenesisRegisterNodeTransaction timestamp. */
        public timestamp: (number|Long);

        /** GenesisRegisterNodeTransaction signature. */
        public signature: Uint8Array;

        /**
         * Creates a new GenesisRegisterNodeTransaction instance using the specified properties.
         * @param [properties] Properties to set
         * @returns GenesisRegisterNodeTransaction instance
         */
        public static create(properties?: wavesenterprise.IGenesisRegisterNodeTransaction): wavesenterprise.GenesisRegisterNodeTransaction;

        /**
         * Encodes the specified GenesisRegisterNodeTransaction message. Does not implicitly {@link wavesenterprise.GenesisRegisterNodeTransaction.verify|verify} messages.
         * @param message GenesisRegisterNodeTransaction message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: wavesenterprise.IGenesisRegisterNodeTransaction, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified GenesisRegisterNodeTransaction message, length delimited. Does not implicitly {@link wavesenterprise.GenesisRegisterNodeTransaction.verify|verify} messages.
         * @param message GenesisRegisterNodeTransaction message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: wavesenterprise.IGenesisRegisterNodeTransaction, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a GenesisRegisterNodeTransaction message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns GenesisRegisterNodeTransaction
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): wavesenterprise.GenesisRegisterNodeTransaction;

        /**
         * Decodes a GenesisRegisterNodeTransaction message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns GenesisRegisterNodeTransaction
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): wavesenterprise.GenesisRegisterNodeTransaction;

        /**
         * Verifies a GenesisRegisterNodeTransaction message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a GenesisRegisterNodeTransaction message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns GenesisRegisterNodeTransaction
         */
        public static fromObject(object: { [k: string]: any }): wavesenterprise.GenesisRegisterNodeTransaction;

        /**
         * Creates a plain object from a GenesisRegisterNodeTransaction message. Also converts values to other types if specified.
         * @param message GenesisRegisterNodeTransaction
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: wavesenterprise.GenesisRegisterNodeTransaction, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this GenesisRegisterNodeTransaction to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a RegisterNodeTransaction. */
    interface IRegisterNodeTransaction {

        /** RegisterNodeTransaction id */
        id?: (Uint8Array|null);

        /** RegisterNodeTransaction senderPublicKey */
        senderPublicKey?: (Uint8Array|null);

        /** RegisterNodeTransaction target */
        target?: (Uint8Array|null);

        /** RegisterNodeTransaction nodeName */
        nodeName?: (google.protobuf.IStringValue|null);

        /** RegisterNodeTransaction opType */
        opType?: (wavesenterprise.OpType|null);

        /** RegisterNodeTransaction timestamp */
        timestamp?: (number|Long|null);

        /** RegisterNodeTransaction fee */
        fee?: (number|Long|null);

        /** RegisterNodeTransaction proofs */
        proofs?: (Uint8Array[]|null);
    }

    /** Represents a RegisterNodeTransaction. */
    class RegisterNodeTransaction implements IRegisterNodeTransaction {

        /**
         * Constructs a new RegisterNodeTransaction.
         * @param [properties] Properties to set
         */
        constructor(properties?: wavesenterprise.IRegisterNodeTransaction);

        /** RegisterNodeTransaction id. */
        public id: Uint8Array;

        /** RegisterNodeTransaction senderPublicKey. */
        public senderPublicKey: Uint8Array;

        /** RegisterNodeTransaction target. */
        public target: Uint8Array;

        /** RegisterNodeTransaction nodeName. */
        public nodeName?: (google.protobuf.IStringValue|null);

        /** RegisterNodeTransaction opType. */
        public opType: wavesenterprise.OpType;

        /** RegisterNodeTransaction timestamp. */
        public timestamp: (number|Long);

        /** RegisterNodeTransaction fee. */
        public fee: (number|Long);

        /** RegisterNodeTransaction proofs. */
        public proofs: Uint8Array[];

        /**
         * Creates a new RegisterNodeTransaction instance using the specified properties.
         * @param [properties] Properties to set
         * @returns RegisterNodeTransaction instance
         */
        public static create(properties?: wavesenterprise.IRegisterNodeTransaction): wavesenterprise.RegisterNodeTransaction;

        /**
         * Encodes the specified RegisterNodeTransaction message. Does not implicitly {@link wavesenterprise.RegisterNodeTransaction.verify|verify} messages.
         * @param message RegisterNodeTransaction message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: wavesenterprise.IRegisterNodeTransaction, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified RegisterNodeTransaction message, length delimited. Does not implicitly {@link wavesenterprise.RegisterNodeTransaction.verify|verify} messages.
         * @param message RegisterNodeTransaction message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: wavesenterprise.IRegisterNodeTransaction, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a RegisterNodeTransaction message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns RegisterNodeTransaction
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): wavesenterprise.RegisterNodeTransaction;

        /**
         * Decodes a RegisterNodeTransaction message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns RegisterNodeTransaction
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): wavesenterprise.RegisterNodeTransaction;

        /**
         * Verifies a RegisterNodeTransaction message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a RegisterNodeTransaction message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns RegisterNodeTransaction
         */
        public static fromObject(object: { [k: string]: any }): wavesenterprise.RegisterNodeTransaction;

        /**
         * Creates a plain object from a RegisterNodeTransaction message. Also converts values to other types if specified.
         * @param message RegisterNodeTransaction
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: wavesenterprise.RegisterNodeTransaction, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this RegisterNodeTransaction to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** OpType enum. */
    enum OpType {
        UNKNOWN_OP_TYPE = 0,
        ADD = 1,
        REMOVE = 2
    }

    /** Properties of a CreateAliasTransaction. */
    interface ICreateAliasTransaction {

        /** CreateAliasTransaction id */
        id?: (Uint8Array|null);

        /** CreateAliasTransaction senderPublicKey */
        senderPublicKey?: (Uint8Array|null);

        /** CreateAliasTransaction alias */
        alias?: (Uint8Array|null);

        /** CreateAliasTransaction fee */
        fee?: (number|Long|null);

        /** CreateAliasTransaction timestamp */
        timestamp?: (number|Long|null);

        /** CreateAliasTransaction feeAssetId */
        feeAssetId?: (google.protobuf.IBytesValue|null);

        /** CreateAliasTransaction proofs */
        proofs?: (Uint8Array[]|null);
    }

    /** Represents a CreateAliasTransaction. */
    class CreateAliasTransaction implements ICreateAliasTransaction {

        /**
         * Constructs a new CreateAliasTransaction.
         * @param [properties] Properties to set
         */
        constructor(properties?: wavesenterprise.ICreateAliasTransaction);

        /** CreateAliasTransaction id. */
        public id: Uint8Array;

        /** CreateAliasTransaction senderPublicKey. */
        public senderPublicKey: Uint8Array;

        /** CreateAliasTransaction alias. */
        public alias: Uint8Array;

        /** CreateAliasTransaction fee. */
        public fee: (number|Long);

        /** CreateAliasTransaction timestamp. */
        public timestamp: (number|Long);

        /** CreateAliasTransaction feeAssetId. */
        public feeAssetId?: (google.protobuf.IBytesValue|null);

        /** CreateAliasTransaction proofs. */
        public proofs: Uint8Array[];

        /**
         * Creates a new CreateAliasTransaction instance using the specified properties.
         * @param [properties] Properties to set
         * @returns CreateAliasTransaction instance
         */
        public static create(properties?: wavesenterprise.ICreateAliasTransaction): wavesenterprise.CreateAliasTransaction;

        /**
         * Encodes the specified CreateAliasTransaction message. Does not implicitly {@link wavesenterprise.CreateAliasTransaction.verify|verify} messages.
         * @param message CreateAliasTransaction message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: wavesenterprise.ICreateAliasTransaction, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified CreateAliasTransaction message, length delimited. Does not implicitly {@link wavesenterprise.CreateAliasTransaction.verify|verify} messages.
         * @param message CreateAliasTransaction message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: wavesenterprise.ICreateAliasTransaction, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a CreateAliasTransaction message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns CreateAliasTransaction
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): wavesenterprise.CreateAliasTransaction;

        /**
         * Decodes a CreateAliasTransaction message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns CreateAliasTransaction
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): wavesenterprise.CreateAliasTransaction;

        /**
         * Verifies a CreateAliasTransaction message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a CreateAliasTransaction message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns CreateAliasTransaction
         */
        public static fromObject(object: { [k: string]: any }): wavesenterprise.CreateAliasTransaction;

        /**
         * Creates a plain object from a CreateAliasTransaction message. Also converts values to other types if specified.
         * @param message CreateAliasTransaction
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: wavesenterprise.CreateAliasTransaction, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this CreateAliasTransaction to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of an IssueTransaction. */
    interface IIssueTransaction {

        /** IssueTransaction id */
        id?: (Uint8Array|null);

        /** IssueTransaction chainId */
        chainId?: (number|null);

        /** IssueTransaction senderPublicKey */
        senderPublicKey?: (Uint8Array|null);

        /** IssueTransaction name */
        name?: (Uint8Array|null);

        /** IssueTransaction description */
        description?: (Uint8Array|null);

        /** IssueTransaction quantity */
        quantity?: (number|Long|null);

        /** IssueTransaction decimals */
        decimals?: (number|null);

        /** IssueTransaction reissuable */
        reissuable?: (boolean|null);

        /** IssueTransaction fee */
        fee?: (number|Long|null);

        /** IssueTransaction timestamp */
        timestamp?: (number|Long|null);

        /** IssueTransaction script */
        script?: (google.protobuf.IBytesValue|null);

        /** IssueTransaction proofs */
        proofs?: (Uint8Array[]|null);
    }

    /** Represents an IssueTransaction. */
    class IssueTransaction implements IIssueTransaction {

        /**
         * Constructs a new IssueTransaction.
         * @param [properties] Properties to set
         */
        constructor(properties?: wavesenterprise.IIssueTransaction);

        /** IssueTransaction id. */
        public id: Uint8Array;

        /** IssueTransaction chainId. */
        public chainId: number;

        /** IssueTransaction senderPublicKey. */
        public senderPublicKey: Uint8Array;

        /** IssueTransaction name. */
        public name: Uint8Array;

        /** IssueTransaction description. */
        public description: Uint8Array;

        /** IssueTransaction quantity. */
        public quantity: (number|Long);

        /** IssueTransaction decimals. */
        public decimals: number;

        /** IssueTransaction reissuable. */
        public reissuable: boolean;

        /** IssueTransaction fee. */
        public fee: (number|Long);

        /** IssueTransaction timestamp. */
        public timestamp: (number|Long);

        /** IssueTransaction script. */
        public script?: (google.protobuf.IBytesValue|null);

        /** IssueTransaction proofs. */
        public proofs: Uint8Array[];

        /**
         * Creates a new IssueTransaction instance using the specified properties.
         * @param [properties] Properties to set
         * @returns IssueTransaction instance
         */
        public static create(properties?: wavesenterprise.IIssueTransaction): wavesenterprise.IssueTransaction;

        /**
         * Encodes the specified IssueTransaction message. Does not implicitly {@link wavesenterprise.IssueTransaction.verify|verify} messages.
         * @param message IssueTransaction message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: wavesenterprise.IIssueTransaction, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified IssueTransaction message, length delimited. Does not implicitly {@link wavesenterprise.IssueTransaction.verify|verify} messages.
         * @param message IssueTransaction message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: wavesenterprise.IIssueTransaction, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes an IssueTransaction message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns IssueTransaction
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): wavesenterprise.IssueTransaction;

        /**
         * Decodes an IssueTransaction message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns IssueTransaction
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): wavesenterprise.IssueTransaction;

        /**
         * Verifies an IssueTransaction message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates an IssueTransaction message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns IssueTransaction
         */
        public static fromObject(object: { [k: string]: any }): wavesenterprise.IssueTransaction;

        /**
         * Creates a plain object from an IssueTransaction message. Also converts values to other types if specified.
         * @param message IssueTransaction
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: wavesenterprise.IssueTransaction, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this IssueTransaction to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a ReissueTransaction. */
    interface IReissueTransaction {

        /** ReissueTransaction id */
        id?: (Uint8Array|null);

        /** ReissueTransaction chainId */
        chainId?: (number|null);

        /** ReissueTransaction senderPublicKey */
        senderPublicKey?: (Uint8Array|null);

        /** ReissueTransaction assetId */
        assetId?: (Uint8Array|null);

        /** ReissueTransaction quantity */
        quantity?: (number|Long|null);

        /** ReissueTransaction reissuable */
        reissuable?: (boolean|null);

        /** ReissueTransaction fee */
        fee?: (number|Long|null);

        /** ReissueTransaction timestamp */
        timestamp?: (number|Long|null);

        /** ReissueTransaction proofs */
        proofs?: (Uint8Array[]|null);
    }

    /** Represents a ReissueTransaction. */
    class ReissueTransaction implements IReissueTransaction {

        /**
         * Constructs a new ReissueTransaction.
         * @param [properties] Properties to set
         */
        constructor(properties?: wavesenterprise.IReissueTransaction);

        /** ReissueTransaction id. */
        public id: Uint8Array;

        /** ReissueTransaction chainId. */
        public chainId: number;

        /** ReissueTransaction senderPublicKey. */
        public senderPublicKey: Uint8Array;

        /** ReissueTransaction assetId. */
        public assetId: Uint8Array;

        /** ReissueTransaction quantity. */
        public quantity: (number|Long);

        /** ReissueTransaction reissuable. */
        public reissuable: boolean;

        /** ReissueTransaction fee. */
        public fee: (number|Long);

        /** ReissueTransaction timestamp. */
        public timestamp: (number|Long);

        /** ReissueTransaction proofs. */
        public proofs: Uint8Array[];

        /**
         * Creates a new ReissueTransaction instance using the specified properties.
         * @param [properties] Properties to set
         * @returns ReissueTransaction instance
         */
        public static create(properties?: wavesenterprise.IReissueTransaction): wavesenterprise.ReissueTransaction;

        /**
         * Encodes the specified ReissueTransaction message. Does not implicitly {@link wavesenterprise.ReissueTransaction.verify|verify} messages.
         * @param message ReissueTransaction message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: wavesenterprise.IReissueTransaction, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified ReissueTransaction message, length delimited. Does not implicitly {@link wavesenterprise.ReissueTransaction.verify|verify} messages.
         * @param message ReissueTransaction message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: wavesenterprise.IReissueTransaction, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a ReissueTransaction message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns ReissueTransaction
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): wavesenterprise.ReissueTransaction;

        /**
         * Decodes a ReissueTransaction message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns ReissueTransaction
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): wavesenterprise.ReissueTransaction;

        /**
         * Verifies a ReissueTransaction message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a ReissueTransaction message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns ReissueTransaction
         */
        public static fromObject(object: { [k: string]: any }): wavesenterprise.ReissueTransaction;

        /**
         * Creates a plain object from a ReissueTransaction message. Also converts values to other types if specified.
         * @param message ReissueTransaction
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: wavesenterprise.ReissueTransaction, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this ReissueTransaction to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a BurnTransaction. */
    interface IBurnTransaction {

        /** BurnTransaction id */
        id?: (Uint8Array|null);

        /** BurnTransaction chainId */
        chainId?: (number|null);

        /** BurnTransaction senderPublicKey */
        senderPublicKey?: (Uint8Array|null);

        /** BurnTransaction assetId */
        assetId?: (Uint8Array|null);

        /** BurnTransaction amount */
        amount?: (number|Long|null);

        /** BurnTransaction fee */
        fee?: (number|Long|null);

        /** BurnTransaction timestamp */
        timestamp?: (number|Long|null);

        /** BurnTransaction proofs */
        proofs?: (Uint8Array[]|null);
    }

    /** Represents a BurnTransaction. */
    class BurnTransaction implements IBurnTransaction {

        /**
         * Constructs a new BurnTransaction.
         * @param [properties] Properties to set
         */
        constructor(properties?: wavesenterprise.IBurnTransaction);

        /** BurnTransaction id. */
        public id: Uint8Array;

        /** BurnTransaction chainId. */
        public chainId: number;

        /** BurnTransaction senderPublicKey. */
        public senderPublicKey: Uint8Array;

        /** BurnTransaction assetId. */
        public assetId: Uint8Array;

        /** BurnTransaction amount. */
        public amount: (number|Long);

        /** BurnTransaction fee. */
        public fee: (number|Long);

        /** BurnTransaction timestamp. */
        public timestamp: (number|Long);

        /** BurnTransaction proofs. */
        public proofs: Uint8Array[];

        /**
         * Creates a new BurnTransaction instance using the specified properties.
         * @param [properties] Properties to set
         * @returns BurnTransaction instance
         */
        public static create(properties?: wavesenterprise.IBurnTransaction): wavesenterprise.BurnTransaction;

        /**
         * Encodes the specified BurnTransaction message. Does not implicitly {@link wavesenterprise.BurnTransaction.verify|verify} messages.
         * @param message BurnTransaction message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: wavesenterprise.IBurnTransaction, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified BurnTransaction message, length delimited. Does not implicitly {@link wavesenterprise.BurnTransaction.verify|verify} messages.
         * @param message BurnTransaction message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: wavesenterprise.IBurnTransaction, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a BurnTransaction message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns BurnTransaction
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): wavesenterprise.BurnTransaction;

        /**
         * Decodes a BurnTransaction message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns BurnTransaction
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): wavesenterprise.BurnTransaction;

        /**
         * Verifies a BurnTransaction message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a BurnTransaction message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns BurnTransaction
         */
        public static fromObject(object: { [k: string]: any }): wavesenterprise.BurnTransaction;

        /**
         * Creates a plain object from a BurnTransaction message. Also converts values to other types if specified.
         * @param message BurnTransaction
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: wavesenterprise.BurnTransaction, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this BurnTransaction to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a LeaseTransaction. */
    interface ILeaseTransaction {

        /** LeaseTransaction id */
        id?: (Uint8Array|null);

        /** LeaseTransaction assetId */
        assetId?: (google.protobuf.IBytesValue|null);

        /** LeaseTransaction senderPublicKey */
        senderPublicKey?: (Uint8Array|null);

        /** LeaseTransaction recipient */
        recipient?: (Uint8Array|null);

        /** LeaseTransaction amount */
        amount?: (number|Long|null);

        /** LeaseTransaction fee */
        fee?: (number|Long|null);

        /** LeaseTransaction timestamp */
        timestamp?: (number|Long|null);

        /** LeaseTransaction proofs */
        proofs?: (Uint8Array[]|null);
    }

    /** Represents a LeaseTransaction. */
    class LeaseTransaction implements ILeaseTransaction {

        /**
         * Constructs a new LeaseTransaction.
         * @param [properties] Properties to set
         */
        constructor(properties?: wavesenterprise.ILeaseTransaction);

        /** LeaseTransaction id. */
        public id: Uint8Array;

        /** LeaseTransaction assetId. */
        public assetId?: (google.protobuf.IBytesValue|null);

        /** LeaseTransaction senderPublicKey. */
        public senderPublicKey: Uint8Array;

        /** LeaseTransaction recipient. */
        public recipient: Uint8Array;

        /** LeaseTransaction amount. */
        public amount: (number|Long);

        /** LeaseTransaction fee. */
        public fee: (number|Long);

        /** LeaseTransaction timestamp. */
        public timestamp: (number|Long);

        /** LeaseTransaction proofs. */
        public proofs: Uint8Array[];

        /**
         * Creates a new LeaseTransaction instance using the specified properties.
         * @param [properties] Properties to set
         * @returns LeaseTransaction instance
         */
        public static create(properties?: wavesenterprise.ILeaseTransaction): wavesenterprise.LeaseTransaction;

        /**
         * Encodes the specified LeaseTransaction message. Does not implicitly {@link wavesenterprise.LeaseTransaction.verify|verify} messages.
         * @param message LeaseTransaction message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: wavesenterprise.ILeaseTransaction, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified LeaseTransaction message, length delimited. Does not implicitly {@link wavesenterprise.LeaseTransaction.verify|verify} messages.
         * @param message LeaseTransaction message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: wavesenterprise.ILeaseTransaction, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a LeaseTransaction message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns LeaseTransaction
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): wavesenterprise.LeaseTransaction;

        /**
         * Decodes a LeaseTransaction message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns LeaseTransaction
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): wavesenterprise.LeaseTransaction;

        /**
         * Verifies a LeaseTransaction message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a LeaseTransaction message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns LeaseTransaction
         */
        public static fromObject(object: { [k: string]: any }): wavesenterprise.LeaseTransaction;

        /**
         * Creates a plain object from a LeaseTransaction message. Also converts values to other types if specified.
         * @param message LeaseTransaction
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: wavesenterprise.LeaseTransaction, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this LeaseTransaction to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a LeaseCancelTransaction. */
    interface ILeaseCancelTransaction {

        /** LeaseCancelTransaction id */
        id?: (Uint8Array|null);

        /** LeaseCancelTransaction chainId */
        chainId?: (number|null);

        /** LeaseCancelTransaction senderPublicKey */
        senderPublicKey?: (Uint8Array|null);

        /** LeaseCancelTransaction fee */
        fee?: (number|Long|null);

        /** LeaseCancelTransaction timestamp */
        timestamp?: (number|Long|null);

        /** LeaseCancelTransaction leaseId */
        leaseId?: (Uint8Array|null);

        /** LeaseCancelTransaction proofs */
        proofs?: (Uint8Array[]|null);
    }

    /** Represents a LeaseCancelTransaction. */
    class LeaseCancelTransaction implements ILeaseCancelTransaction {

        /**
         * Constructs a new LeaseCancelTransaction.
         * @param [properties] Properties to set
         */
        constructor(properties?: wavesenterprise.ILeaseCancelTransaction);

        /** LeaseCancelTransaction id. */
        public id: Uint8Array;

        /** LeaseCancelTransaction chainId. */
        public chainId: number;

        /** LeaseCancelTransaction senderPublicKey. */
        public senderPublicKey: Uint8Array;

        /** LeaseCancelTransaction fee. */
        public fee: (number|Long);

        /** LeaseCancelTransaction timestamp. */
        public timestamp: (number|Long);

        /** LeaseCancelTransaction leaseId. */
        public leaseId: Uint8Array;

        /** LeaseCancelTransaction proofs. */
        public proofs: Uint8Array[];

        /**
         * Creates a new LeaseCancelTransaction instance using the specified properties.
         * @param [properties] Properties to set
         * @returns LeaseCancelTransaction instance
         */
        public static create(properties?: wavesenterprise.ILeaseCancelTransaction): wavesenterprise.LeaseCancelTransaction;

        /**
         * Encodes the specified LeaseCancelTransaction message. Does not implicitly {@link wavesenterprise.LeaseCancelTransaction.verify|verify} messages.
         * @param message LeaseCancelTransaction message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: wavesenterprise.ILeaseCancelTransaction, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified LeaseCancelTransaction message, length delimited. Does not implicitly {@link wavesenterprise.LeaseCancelTransaction.verify|verify} messages.
         * @param message LeaseCancelTransaction message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: wavesenterprise.ILeaseCancelTransaction, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a LeaseCancelTransaction message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns LeaseCancelTransaction
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): wavesenterprise.LeaseCancelTransaction;

        /**
         * Decodes a LeaseCancelTransaction message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns LeaseCancelTransaction
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): wavesenterprise.LeaseCancelTransaction;

        /**
         * Verifies a LeaseCancelTransaction message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a LeaseCancelTransaction message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns LeaseCancelTransaction
         */
        public static fromObject(object: { [k: string]: any }): wavesenterprise.LeaseCancelTransaction;

        /**
         * Creates a plain object from a LeaseCancelTransaction message. Also converts values to other types if specified.
         * @param message LeaseCancelTransaction
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: wavesenterprise.LeaseCancelTransaction, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this LeaseCancelTransaction to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a SponsorFeeTransaction. */
    interface ISponsorFeeTransaction {

        /** SponsorFeeTransaction id */
        id?: (Uint8Array|null);

        /** SponsorFeeTransaction senderPublicKey */
        senderPublicKey?: (Uint8Array|null);

        /** SponsorFeeTransaction assetId */
        assetId?: (Uint8Array|null);

        /** SponsorFeeTransaction isEnabled */
        isEnabled?: (boolean|null);

        /** SponsorFeeTransaction fee */
        fee?: (number|Long|null);

        /** SponsorFeeTransaction timestamp */
        timestamp?: (number|Long|null);

        /** SponsorFeeTransaction proofs */
        proofs?: (Uint8Array[]|null);
    }

    /** Represents a SponsorFeeTransaction. */
    class SponsorFeeTransaction implements ISponsorFeeTransaction {

        /**
         * Constructs a new SponsorFeeTransaction.
         * @param [properties] Properties to set
         */
        constructor(properties?: wavesenterprise.ISponsorFeeTransaction);

        /** SponsorFeeTransaction id. */
        public id: Uint8Array;

        /** SponsorFeeTransaction senderPublicKey. */
        public senderPublicKey: Uint8Array;

        /** SponsorFeeTransaction assetId. */
        public assetId: Uint8Array;

        /** SponsorFeeTransaction isEnabled. */
        public isEnabled: boolean;

        /** SponsorFeeTransaction fee. */
        public fee: (number|Long);

        /** SponsorFeeTransaction timestamp. */
        public timestamp: (number|Long);

        /** SponsorFeeTransaction proofs. */
        public proofs: Uint8Array[];

        /**
         * Creates a new SponsorFeeTransaction instance using the specified properties.
         * @param [properties] Properties to set
         * @returns SponsorFeeTransaction instance
         */
        public static create(properties?: wavesenterprise.ISponsorFeeTransaction): wavesenterprise.SponsorFeeTransaction;

        /**
         * Encodes the specified SponsorFeeTransaction message. Does not implicitly {@link wavesenterprise.SponsorFeeTransaction.verify|verify} messages.
         * @param message SponsorFeeTransaction message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: wavesenterprise.ISponsorFeeTransaction, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified SponsorFeeTransaction message, length delimited. Does not implicitly {@link wavesenterprise.SponsorFeeTransaction.verify|verify} messages.
         * @param message SponsorFeeTransaction message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: wavesenterprise.ISponsorFeeTransaction, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a SponsorFeeTransaction message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns SponsorFeeTransaction
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): wavesenterprise.SponsorFeeTransaction;

        /**
         * Decodes a SponsorFeeTransaction message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns SponsorFeeTransaction
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): wavesenterprise.SponsorFeeTransaction;

        /**
         * Verifies a SponsorFeeTransaction message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a SponsorFeeTransaction message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns SponsorFeeTransaction
         */
        public static fromObject(object: { [k: string]: any }): wavesenterprise.SponsorFeeTransaction;

        /**
         * Creates a plain object from a SponsorFeeTransaction message. Also converts values to other types if specified.
         * @param message SponsorFeeTransaction
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: wavesenterprise.SponsorFeeTransaction, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this SponsorFeeTransaction to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a SetAssetScriptTransaction. */
    interface ISetAssetScriptTransaction {

        /** SetAssetScriptTransaction id */
        id?: (Uint8Array|null);

        /** SetAssetScriptTransaction chainId */
        chainId?: (number|null);

        /** SetAssetScriptTransaction senderPublicKey */
        senderPublicKey?: (Uint8Array|null);

        /** SetAssetScriptTransaction assetId */
        assetId?: (Uint8Array|null);

        /** SetAssetScriptTransaction script */
        script?: (google.protobuf.IBytesValue|null);

        /** SetAssetScriptTransaction fee */
        fee?: (number|Long|null);

        /** SetAssetScriptTransaction timestamp */
        timestamp?: (number|Long|null);

        /** SetAssetScriptTransaction proofs */
        proofs?: (Uint8Array[]|null);
    }

    /** Represents a SetAssetScriptTransaction. */
    class SetAssetScriptTransaction implements ISetAssetScriptTransaction {

        /**
         * Constructs a new SetAssetScriptTransaction.
         * @param [properties] Properties to set
         */
        constructor(properties?: wavesenterprise.ISetAssetScriptTransaction);

        /** SetAssetScriptTransaction id. */
        public id: Uint8Array;

        /** SetAssetScriptTransaction chainId. */
        public chainId: number;

        /** SetAssetScriptTransaction senderPublicKey. */
        public senderPublicKey: Uint8Array;

        /** SetAssetScriptTransaction assetId. */
        public assetId: Uint8Array;

        /** SetAssetScriptTransaction script. */
        public script?: (google.protobuf.IBytesValue|null);

        /** SetAssetScriptTransaction fee. */
        public fee: (number|Long);

        /** SetAssetScriptTransaction timestamp. */
        public timestamp: (number|Long);

        /** SetAssetScriptTransaction proofs. */
        public proofs: Uint8Array[];

        /**
         * Creates a new SetAssetScriptTransaction instance using the specified properties.
         * @param [properties] Properties to set
         * @returns SetAssetScriptTransaction instance
         */
        public static create(properties?: wavesenterprise.ISetAssetScriptTransaction): wavesenterprise.SetAssetScriptTransaction;

        /**
         * Encodes the specified SetAssetScriptTransaction message. Does not implicitly {@link wavesenterprise.SetAssetScriptTransaction.verify|verify} messages.
         * @param message SetAssetScriptTransaction message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: wavesenterprise.ISetAssetScriptTransaction, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified SetAssetScriptTransaction message, length delimited. Does not implicitly {@link wavesenterprise.SetAssetScriptTransaction.verify|verify} messages.
         * @param message SetAssetScriptTransaction message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: wavesenterprise.ISetAssetScriptTransaction, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a SetAssetScriptTransaction message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns SetAssetScriptTransaction
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): wavesenterprise.SetAssetScriptTransaction;

        /**
         * Decodes a SetAssetScriptTransaction message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns SetAssetScriptTransaction
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): wavesenterprise.SetAssetScriptTransaction;

        /**
         * Verifies a SetAssetScriptTransaction message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a SetAssetScriptTransaction message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns SetAssetScriptTransaction
         */
        public static fromObject(object: { [k: string]: any }): wavesenterprise.SetAssetScriptTransaction;

        /**
         * Creates a plain object from a SetAssetScriptTransaction message. Also converts values to other types if specified.
         * @param message SetAssetScriptTransaction
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: wavesenterprise.SetAssetScriptTransaction, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this SetAssetScriptTransaction to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a DataTransaction. */
    interface IDataTransaction {

        /** DataTransaction id */
        id?: (Uint8Array|null);

        /** DataTransaction senderPublicKey */
        senderPublicKey?: (Uint8Array|null);

        /** DataTransaction authorPublicKey */
        authorPublicKey?: (Uint8Array|null);

        /** DataTransaction data */
        data?: (wavesenterprise.IDataEntry[]|null);

        /** DataTransaction timestamp */
        timestamp?: (number|Long|null);

        /** DataTransaction fee */
        fee?: (number|Long|null);

        /** DataTransaction feeAssetId */
        feeAssetId?: (google.protobuf.IBytesValue|null);

        /** DataTransaction proofs */
        proofs?: (Uint8Array[]|null);
    }

    /** Represents a DataTransaction. */
    class DataTransaction implements IDataTransaction {

        /**
         * Constructs a new DataTransaction.
         * @param [properties] Properties to set
         */
        constructor(properties?: wavesenterprise.IDataTransaction);

        /** DataTransaction id. */
        public id: Uint8Array;

        /** DataTransaction senderPublicKey. */
        public senderPublicKey: Uint8Array;

        /** DataTransaction authorPublicKey. */
        public authorPublicKey: Uint8Array;

        /** DataTransaction data. */
        public data: wavesenterprise.IDataEntry[];

        /** DataTransaction timestamp. */
        public timestamp: (number|Long);

        /** DataTransaction fee. */
        public fee: (number|Long);

        /** DataTransaction feeAssetId. */
        public feeAssetId?: (google.protobuf.IBytesValue|null);

        /** DataTransaction proofs. */
        public proofs: Uint8Array[];

        /**
         * Creates a new DataTransaction instance using the specified properties.
         * @param [properties] Properties to set
         * @returns DataTransaction instance
         */
        public static create(properties?: wavesenterprise.IDataTransaction): wavesenterprise.DataTransaction;

        /**
         * Encodes the specified DataTransaction message. Does not implicitly {@link wavesenterprise.DataTransaction.verify|verify} messages.
         * @param message DataTransaction message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: wavesenterprise.IDataTransaction, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified DataTransaction message, length delimited. Does not implicitly {@link wavesenterprise.DataTransaction.verify|verify} messages.
         * @param message DataTransaction message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: wavesenterprise.IDataTransaction, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a DataTransaction message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns DataTransaction
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): wavesenterprise.DataTransaction;

        /**
         * Decodes a DataTransaction message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns DataTransaction
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): wavesenterprise.DataTransaction;

        /**
         * Verifies a DataTransaction message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a DataTransaction message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns DataTransaction
         */
        public static fromObject(object: { [k: string]: any }): wavesenterprise.DataTransaction;

        /**
         * Creates a plain object from a DataTransaction message. Also converts values to other types if specified.
         * @param message DataTransaction
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: wavesenterprise.DataTransaction, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this DataTransaction to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a DataEntry. */
    interface IDataEntry {

        /** DataEntry key */
        key?: (string|null);

        /** DataEntry intValue */
        intValue?: (number|Long|null);

        /** DataEntry boolValue */
        boolValue?: (boolean|null);

        /** DataEntry binaryValue */
        binaryValue?: (Uint8Array|null);

        /** DataEntry stringValue */
        stringValue?: (string|null);
    }

    /** Represents a DataEntry. */
    class DataEntry implements IDataEntry {

        /**
         * Constructs a new DataEntry.
         * @param [properties] Properties to set
         */
        constructor(properties?: wavesenterprise.IDataEntry);

        /** DataEntry key. */
        public key: string;

        /** DataEntry intValue. */
        public intValue?: (number|Long|null);

        /** DataEntry boolValue. */
        public boolValue?: (boolean|null);

        /** DataEntry binaryValue. */
        public binaryValue?: (Uint8Array|null);

        /** DataEntry stringValue. */
        public stringValue?: (string|null);

        /** DataEntry value. */
        public value?: ("intValue"|"boolValue"|"binaryValue"|"stringValue");

        /**
         * Creates a new DataEntry instance using the specified properties.
         * @param [properties] Properties to set
         * @returns DataEntry instance
         */
        public static create(properties?: wavesenterprise.IDataEntry): wavesenterprise.DataEntry;

        /**
         * Encodes the specified DataEntry message. Does not implicitly {@link wavesenterprise.DataEntry.verify|verify} messages.
         * @param message DataEntry message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: wavesenterprise.IDataEntry, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified DataEntry message, length delimited. Does not implicitly {@link wavesenterprise.DataEntry.verify|verify} messages.
         * @param message DataEntry message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: wavesenterprise.IDataEntry, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a DataEntry message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns DataEntry
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): wavesenterprise.DataEntry;

        /**
         * Decodes a DataEntry message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns DataEntry
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): wavesenterprise.DataEntry;

        /**
         * Verifies a DataEntry message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a DataEntry message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns DataEntry
         */
        public static fromObject(object: { [k: string]: any }): wavesenterprise.DataEntry;

        /**
         * Creates a plain object from a DataEntry message. Also converts values to other types if specified.
         * @param message DataEntry
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: wavesenterprise.DataEntry, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this DataEntry to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a TransferTransaction. */
    interface ITransferTransaction {

        /** TransferTransaction id */
        id?: (Uint8Array|null);

        /** TransferTransaction senderPublicKey */
        senderPublicKey?: (Uint8Array|null);

        /** TransferTransaction assetId */
        assetId?: (google.protobuf.IBytesValue|null);

        /** TransferTransaction feeAssetId */
        feeAssetId?: (google.protobuf.IBytesValue|null);

        /** TransferTransaction timestamp */
        timestamp?: (number|Long|null);

        /** TransferTransaction amount */
        amount?: (number|Long|null);

        /** TransferTransaction fee */
        fee?: (number|Long|null);

        /** TransferTransaction recipient */
        recipient?: (Uint8Array|null);

        /** TransferTransaction attachment */
        attachment?: (Uint8Array|null);

        /** TransferTransaction atomicBadge */
        atomicBadge?: (wavesenterprise.IAtomicBadge|null);

        /** TransferTransaction proofs */
        proofs?: (Uint8Array[]|null);
    }

    /** Represents a TransferTransaction. */
    class TransferTransaction implements ITransferTransaction {

        /**
         * Constructs a new TransferTransaction.
         * @param [properties] Properties to set
         */
        constructor(properties?: wavesenterprise.ITransferTransaction);

        /** TransferTransaction id. */
        public id: Uint8Array;

        /** TransferTransaction senderPublicKey. */
        public senderPublicKey: Uint8Array;

        /** TransferTransaction assetId. */
        public assetId?: (google.protobuf.IBytesValue|null);

        /** TransferTransaction feeAssetId. */
        public feeAssetId?: (google.protobuf.IBytesValue|null);

        /** TransferTransaction timestamp. */
        public timestamp: (number|Long);

        /** TransferTransaction amount. */
        public amount: (number|Long);

        /** TransferTransaction fee. */
        public fee: (number|Long);

        /** TransferTransaction recipient. */
        public recipient: Uint8Array;

        /** TransferTransaction attachment. */
        public attachment: Uint8Array;

        /** TransferTransaction atomicBadge. */
        public atomicBadge?: (wavesenterprise.IAtomicBadge|null);

        /** TransferTransaction proofs. */
        public proofs: Uint8Array[];

        /**
         * Creates a new TransferTransaction instance using the specified properties.
         * @param [properties] Properties to set
         * @returns TransferTransaction instance
         */
        public static create(properties?: wavesenterprise.ITransferTransaction): wavesenterprise.TransferTransaction;

        /**
         * Encodes the specified TransferTransaction message. Does not implicitly {@link wavesenterprise.TransferTransaction.verify|verify} messages.
         * @param message TransferTransaction message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: wavesenterprise.ITransferTransaction, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified TransferTransaction message, length delimited. Does not implicitly {@link wavesenterprise.TransferTransaction.verify|verify} messages.
         * @param message TransferTransaction message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: wavesenterprise.ITransferTransaction, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a TransferTransaction message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns TransferTransaction
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): wavesenterprise.TransferTransaction;

        /**
         * Decodes a TransferTransaction message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns TransferTransaction
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): wavesenterprise.TransferTransaction;

        /**
         * Verifies a TransferTransaction message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a TransferTransaction message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns TransferTransaction
         */
        public static fromObject(object: { [k: string]: any }): wavesenterprise.TransferTransaction;

        /**
         * Creates a plain object from a TransferTransaction message. Also converts values to other types if specified.
         * @param message TransferTransaction
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: wavesenterprise.TransferTransaction, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this TransferTransaction to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of an AtomicBadge. */
    interface IAtomicBadge {

        /** AtomicBadge trustedSender */
        trustedSender?: (google.protobuf.IBytesValue|null);
    }

    /** Represents an AtomicBadge. */
    class AtomicBadge implements IAtomicBadge {

        /**
         * Constructs a new AtomicBadge.
         * @param [properties] Properties to set
         */
        constructor(properties?: wavesenterprise.IAtomicBadge);

        /** AtomicBadge trustedSender. */
        public trustedSender?: (google.protobuf.IBytesValue|null);

        /**
         * Creates a new AtomicBadge instance using the specified properties.
         * @param [properties] Properties to set
         * @returns AtomicBadge instance
         */
        public static create(properties?: wavesenterprise.IAtomicBadge): wavesenterprise.AtomicBadge;

        /**
         * Encodes the specified AtomicBadge message. Does not implicitly {@link wavesenterprise.AtomicBadge.verify|verify} messages.
         * @param message AtomicBadge message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: wavesenterprise.IAtomicBadge, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified AtomicBadge message, length delimited. Does not implicitly {@link wavesenterprise.AtomicBadge.verify|verify} messages.
         * @param message AtomicBadge message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: wavesenterprise.IAtomicBadge, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes an AtomicBadge message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns AtomicBadge
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): wavesenterprise.AtomicBadge;

        /**
         * Decodes an AtomicBadge message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns AtomicBadge
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): wavesenterprise.AtomicBadge;

        /**
         * Verifies an AtomicBadge message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates an AtomicBadge message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns AtomicBadge
         */
        public static fromObject(object: { [k: string]: any }): wavesenterprise.AtomicBadge;

        /**
         * Creates a plain object from an AtomicBadge message. Also converts values to other types if specified.
         * @param message AtomicBadge
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: wavesenterprise.AtomicBadge, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this AtomicBadge to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a MassTransferTransaction. */
    interface IMassTransferTransaction {

        /** MassTransferTransaction id */
        id?: (Uint8Array|null);

        /** MassTransferTransaction senderPublicKey */
        senderPublicKey?: (Uint8Array|null);

        /** MassTransferTransaction assetId */
        assetId?: (google.protobuf.IBytesValue|null);

        /** MassTransferTransaction transfers */
        transfers?: (wavesenterprise.ITransfer[]|null);

        /** MassTransferTransaction timestamp */
        timestamp?: (number|Long|null);

        /** MassTransferTransaction fee */
        fee?: (number|Long|null);

        /** MassTransferTransaction attachment */
        attachment?: (Uint8Array|null);

        /** MassTransferTransaction feeAssetId */
        feeAssetId?: (google.protobuf.IBytesValue|null);

        /** MassTransferTransaction proofs */
        proofs?: (Uint8Array[]|null);
    }

    /** Represents a MassTransferTransaction. */
    class MassTransferTransaction implements IMassTransferTransaction {

        /**
         * Constructs a new MassTransferTransaction.
         * @param [properties] Properties to set
         */
        constructor(properties?: wavesenterprise.IMassTransferTransaction);

        /** MassTransferTransaction id. */
        public id: Uint8Array;

        /** MassTransferTransaction senderPublicKey. */
        public senderPublicKey: Uint8Array;

        /** MassTransferTransaction assetId. */
        public assetId?: (google.protobuf.IBytesValue|null);

        /** MassTransferTransaction transfers. */
        public transfers: wavesenterprise.ITransfer[];

        /** MassTransferTransaction timestamp. */
        public timestamp: (number|Long);

        /** MassTransferTransaction fee. */
        public fee: (number|Long);

        /** MassTransferTransaction attachment. */
        public attachment: Uint8Array;

        /** MassTransferTransaction feeAssetId. */
        public feeAssetId?: (google.protobuf.IBytesValue|null);

        /** MassTransferTransaction proofs. */
        public proofs: Uint8Array[];

        /**
         * Creates a new MassTransferTransaction instance using the specified properties.
         * @param [properties] Properties to set
         * @returns MassTransferTransaction instance
         */
        public static create(properties?: wavesenterprise.IMassTransferTransaction): wavesenterprise.MassTransferTransaction;

        /**
         * Encodes the specified MassTransferTransaction message. Does not implicitly {@link wavesenterprise.MassTransferTransaction.verify|verify} messages.
         * @param message MassTransferTransaction message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: wavesenterprise.IMassTransferTransaction, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified MassTransferTransaction message, length delimited. Does not implicitly {@link wavesenterprise.MassTransferTransaction.verify|verify} messages.
         * @param message MassTransferTransaction message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: wavesenterprise.IMassTransferTransaction, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a MassTransferTransaction message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns MassTransferTransaction
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): wavesenterprise.MassTransferTransaction;

        /**
         * Decodes a MassTransferTransaction message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns MassTransferTransaction
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): wavesenterprise.MassTransferTransaction;

        /**
         * Verifies a MassTransferTransaction message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a MassTransferTransaction message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns MassTransferTransaction
         */
        public static fromObject(object: { [k: string]: any }): wavesenterprise.MassTransferTransaction;

        /**
         * Creates a plain object from a MassTransferTransaction message. Also converts values to other types if specified.
         * @param message MassTransferTransaction
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: wavesenterprise.MassTransferTransaction, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this MassTransferTransaction to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a Transfer. */
    interface ITransfer {

        /** Transfer recipient */
        recipient?: (Uint8Array|null);

        /** Transfer amount */
        amount?: (number|Long|null);
    }

    /** Represents a Transfer. */
    class Transfer implements ITransfer {

        /**
         * Constructs a new Transfer.
         * @param [properties] Properties to set
         */
        constructor(properties?: wavesenterprise.ITransfer);

        /** Transfer recipient. */
        public recipient: Uint8Array;

        /** Transfer amount. */
        public amount: (number|Long);

        /**
         * Creates a new Transfer instance using the specified properties.
         * @param [properties] Properties to set
         * @returns Transfer instance
         */
        public static create(properties?: wavesenterprise.ITransfer): wavesenterprise.Transfer;

        /**
         * Encodes the specified Transfer message. Does not implicitly {@link wavesenterprise.Transfer.verify|verify} messages.
         * @param message Transfer message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: wavesenterprise.ITransfer, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified Transfer message, length delimited. Does not implicitly {@link wavesenterprise.Transfer.verify|verify} messages.
         * @param message Transfer message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: wavesenterprise.ITransfer, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a Transfer message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns Transfer
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): wavesenterprise.Transfer;

        /**
         * Decodes a Transfer message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns Transfer
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): wavesenterprise.Transfer;

        /**
         * Verifies a Transfer message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a Transfer message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns Transfer
         */
        public static fromObject(object: { [k: string]: any }): wavesenterprise.Transfer;

        /**
         * Creates a plain object from a Transfer message. Also converts values to other types if specified.
         * @param message Transfer
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: wavesenterprise.Transfer, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this Transfer to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a PermitTransaction. */
    interface IPermitTransaction {

        /** PermitTransaction id */
        id?: (Uint8Array|null);

        /** PermitTransaction senderPublicKey */
        senderPublicKey?: (Uint8Array|null);

        /** PermitTransaction target */
        target?: (Uint8Array|null);

        /** PermitTransaction timestamp */
        timestamp?: (number|Long|null);

        /** PermitTransaction fee */
        fee?: (number|Long|null);

        /** PermitTransaction permissionOp */
        permissionOp?: (wavesenterprise.IPermissionOp|null);

        /** PermitTransaction atomicBadge */
        atomicBadge?: (wavesenterprise.IAtomicBadge|null);

        /** PermitTransaction proofs */
        proofs?: (Uint8Array[]|null);
    }

    /** Represents a PermitTransaction. */
    class PermitTransaction implements IPermitTransaction {

        /**
         * Constructs a new PermitTransaction.
         * @param [properties] Properties to set
         */
        constructor(properties?: wavesenterprise.IPermitTransaction);

        /** PermitTransaction id. */
        public id: Uint8Array;

        /** PermitTransaction senderPublicKey. */
        public senderPublicKey: Uint8Array;

        /** PermitTransaction target. */
        public target: Uint8Array;

        /** PermitTransaction timestamp. */
        public timestamp: (number|Long);

        /** PermitTransaction fee. */
        public fee: (number|Long);

        /** PermitTransaction permissionOp. */
        public permissionOp?: (wavesenterprise.IPermissionOp|null);

        /** PermitTransaction atomicBadge. */
        public atomicBadge?: (wavesenterprise.IAtomicBadge|null);

        /** PermitTransaction proofs. */
        public proofs: Uint8Array[];

        /**
         * Creates a new PermitTransaction instance using the specified properties.
         * @param [properties] Properties to set
         * @returns PermitTransaction instance
         */
        public static create(properties?: wavesenterprise.IPermitTransaction): wavesenterprise.PermitTransaction;

        /**
         * Encodes the specified PermitTransaction message. Does not implicitly {@link wavesenterprise.PermitTransaction.verify|verify} messages.
         * @param message PermitTransaction message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: wavesenterprise.IPermitTransaction, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified PermitTransaction message, length delimited. Does not implicitly {@link wavesenterprise.PermitTransaction.verify|verify} messages.
         * @param message PermitTransaction message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: wavesenterprise.IPermitTransaction, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a PermitTransaction message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns PermitTransaction
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): wavesenterprise.PermitTransaction;

        /**
         * Decodes a PermitTransaction message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns PermitTransaction
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): wavesenterprise.PermitTransaction;

        /**
         * Verifies a PermitTransaction message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a PermitTransaction message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns PermitTransaction
         */
        public static fromObject(object: { [k: string]: any }): wavesenterprise.PermitTransaction;

        /**
         * Creates a plain object from a PermitTransaction message. Also converts values to other types if specified.
         * @param message PermitTransaction
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: wavesenterprise.PermitTransaction, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this PermitTransaction to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a PermissionOp. */
    interface IPermissionOp {

        /** PermissionOp opType */
        opType?: (wavesenterprise.OpType|null);

        /** PermissionOp role */
        role?: (wavesenterprise.IRole|null);

        /** PermissionOp timestamp */
        timestamp?: (number|Long|null);

        /** PermissionOp dueTimestamp */
        dueTimestamp?: (google.protobuf.IInt64Value|null);
    }

    /** Represents a PermissionOp. */
    class PermissionOp implements IPermissionOp {

        /**
         * Constructs a new PermissionOp.
         * @param [properties] Properties to set
         */
        constructor(properties?: wavesenterprise.IPermissionOp);

        /** PermissionOp opType. */
        public opType: wavesenterprise.OpType;

        /** PermissionOp role. */
        public role?: (wavesenterprise.IRole|null);

        /** PermissionOp timestamp. */
        public timestamp: (number|Long);

        /** PermissionOp dueTimestamp. */
        public dueTimestamp?: (google.protobuf.IInt64Value|null);

        /**
         * Creates a new PermissionOp instance using the specified properties.
         * @param [properties] Properties to set
         * @returns PermissionOp instance
         */
        public static create(properties?: wavesenterprise.IPermissionOp): wavesenterprise.PermissionOp;

        /**
         * Encodes the specified PermissionOp message. Does not implicitly {@link wavesenterprise.PermissionOp.verify|verify} messages.
         * @param message PermissionOp message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: wavesenterprise.IPermissionOp, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified PermissionOp message, length delimited. Does not implicitly {@link wavesenterprise.PermissionOp.verify|verify} messages.
         * @param message PermissionOp message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: wavesenterprise.IPermissionOp, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a PermissionOp message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns PermissionOp
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): wavesenterprise.PermissionOp;

        /**
         * Decodes a PermissionOp message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns PermissionOp
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): wavesenterprise.PermissionOp;

        /**
         * Verifies a PermissionOp message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a PermissionOp message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns PermissionOp
         */
        public static fromObject(object: { [k: string]: any }): wavesenterprise.PermissionOp;

        /**
         * Creates a plain object from a PermissionOp message. Also converts values to other types if specified.
         * @param message PermissionOp
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: wavesenterprise.PermissionOp, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this PermissionOp to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a CreatePolicyTransaction. */
    interface ICreatePolicyTransaction {

        /** CreatePolicyTransaction id */
        id?: (Uint8Array|null);

        /** CreatePolicyTransaction senderPublicKey */
        senderPublicKey?: (Uint8Array|null);

        /** CreatePolicyTransaction policyName */
        policyName?: (string|null);

        /** CreatePolicyTransaction description */
        description?: (string|null);

        /** CreatePolicyTransaction recipients */
        recipients?: (Uint8Array[]|null);

        /** CreatePolicyTransaction owners */
        owners?: (Uint8Array[]|null);

        /** CreatePolicyTransaction timestamp */
        timestamp?: (number|Long|null);

        /** CreatePolicyTransaction fee */
        fee?: (number|Long|null);

        /** CreatePolicyTransaction feeAssetId */
        feeAssetId?: (google.protobuf.IBytesValue|null);

        /** CreatePolicyTransaction atomicBadge */
        atomicBadge?: (wavesenterprise.IAtomicBadge|null);

        /** CreatePolicyTransaction proofs */
        proofs?: (Uint8Array[]|null);
    }

    /** Represents a CreatePolicyTransaction. */
    class CreatePolicyTransaction implements ICreatePolicyTransaction {

        /**
         * Constructs a new CreatePolicyTransaction.
         * @param [properties] Properties to set
         */
        constructor(properties?: wavesenterprise.ICreatePolicyTransaction);

        /** CreatePolicyTransaction id. */
        public id: Uint8Array;

        /** CreatePolicyTransaction senderPublicKey. */
        public senderPublicKey: Uint8Array;

        /** CreatePolicyTransaction policyName. */
        public policyName: string;

        /** CreatePolicyTransaction description. */
        public description: string;

        /** CreatePolicyTransaction recipients. */
        public recipients: Uint8Array[];

        /** CreatePolicyTransaction owners. */
        public owners: Uint8Array[];

        /** CreatePolicyTransaction timestamp. */
        public timestamp: (number|Long);

        /** CreatePolicyTransaction fee. */
        public fee: (number|Long);

        /** CreatePolicyTransaction feeAssetId. */
        public feeAssetId?: (google.protobuf.IBytesValue|null);

        /** CreatePolicyTransaction atomicBadge. */
        public atomicBadge?: (wavesenterprise.IAtomicBadge|null);

        /** CreatePolicyTransaction proofs. */
        public proofs: Uint8Array[];

        /**
         * Creates a new CreatePolicyTransaction instance using the specified properties.
         * @param [properties] Properties to set
         * @returns CreatePolicyTransaction instance
         */
        public static create(properties?: wavesenterprise.ICreatePolicyTransaction): wavesenterprise.CreatePolicyTransaction;

        /**
         * Encodes the specified CreatePolicyTransaction message. Does not implicitly {@link wavesenterprise.CreatePolicyTransaction.verify|verify} messages.
         * @param message CreatePolicyTransaction message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: wavesenterprise.ICreatePolicyTransaction, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified CreatePolicyTransaction message, length delimited. Does not implicitly {@link wavesenterprise.CreatePolicyTransaction.verify|verify} messages.
         * @param message CreatePolicyTransaction message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: wavesenterprise.ICreatePolicyTransaction, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a CreatePolicyTransaction message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns CreatePolicyTransaction
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): wavesenterprise.CreatePolicyTransaction;

        /**
         * Decodes a CreatePolicyTransaction message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns CreatePolicyTransaction
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): wavesenterprise.CreatePolicyTransaction;

        /**
         * Verifies a CreatePolicyTransaction message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a CreatePolicyTransaction message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns CreatePolicyTransaction
         */
        public static fromObject(object: { [k: string]: any }): wavesenterprise.CreatePolicyTransaction;

        /**
         * Creates a plain object from a CreatePolicyTransaction message. Also converts values to other types if specified.
         * @param message CreatePolicyTransaction
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: wavesenterprise.CreatePolicyTransaction, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this CreatePolicyTransaction to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of an UpdatePolicyTransaction. */
    interface IUpdatePolicyTransaction {

        /** UpdatePolicyTransaction id */
        id?: (Uint8Array|null);

        /** UpdatePolicyTransaction senderPublicKey */
        senderPublicKey?: (Uint8Array|null);

        /** UpdatePolicyTransaction policyId */
        policyId?: (Uint8Array|null);

        /** UpdatePolicyTransaction recipients */
        recipients?: (Uint8Array[]|null);

        /** UpdatePolicyTransaction owners */
        owners?: (Uint8Array[]|null);

        /** UpdatePolicyTransaction opType */
        opType?: (wavesenterprise.OpType|null);

        /** UpdatePolicyTransaction timestamp */
        timestamp?: (number|Long|null);

        /** UpdatePolicyTransaction fee */
        fee?: (number|Long|null);

        /** UpdatePolicyTransaction feeAssetId */
        feeAssetId?: (google.protobuf.IBytesValue|null);

        /** UpdatePolicyTransaction atomicBadge */
        atomicBadge?: (wavesenterprise.IAtomicBadge|null);

        /** UpdatePolicyTransaction proofs */
        proofs?: (Uint8Array[]|null);
    }

    /** Represents an UpdatePolicyTransaction. */
    class UpdatePolicyTransaction implements IUpdatePolicyTransaction {

        /**
         * Constructs a new UpdatePolicyTransaction.
         * @param [properties] Properties to set
         */
        constructor(properties?: wavesenterprise.IUpdatePolicyTransaction);

        /** UpdatePolicyTransaction id. */
        public id: Uint8Array;

        /** UpdatePolicyTransaction senderPublicKey. */
        public senderPublicKey: Uint8Array;

        /** UpdatePolicyTransaction policyId. */
        public policyId: Uint8Array;

        /** UpdatePolicyTransaction recipients. */
        public recipients: Uint8Array[];

        /** UpdatePolicyTransaction owners. */
        public owners: Uint8Array[];

        /** UpdatePolicyTransaction opType. */
        public opType: wavesenterprise.OpType;

        /** UpdatePolicyTransaction timestamp. */
        public timestamp: (number|Long);

        /** UpdatePolicyTransaction fee. */
        public fee: (number|Long);

        /** UpdatePolicyTransaction feeAssetId. */
        public feeAssetId?: (google.protobuf.IBytesValue|null);

        /** UpdatePolicyTransaction atomicBadge. */
        public atomicBadge?: (wavesenterprise.IAtomicBadge|null);

        /** UpdatePolicyTransaction proofs. */
        public proofs: Uint8Array[];

        /**
         * Creates a new UpdatePolicyTransaction instance using the specified properties.
         * @param [properties] Properties to set
         * @returns UpdatePolicyTransaction instance
         */
        public static create(properties?: wavesenterprise.IUpdatePolicyTransaction): wavesenterprise.UpdatePolicyTransaction;

        /**
         * Encodes the specified UpdatePolicyTransaction message. Does not implicitly {@link wavesenterprise.UpdatePolicyTransaction.verify|verify} messages.
         * @param message UpdatePolicyTransaction message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: wavesenterprise.IUpdatePolicyTransaction, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified UpdatePolicyTransaction message, length delimited. Does not implicitly {@link wavesenterprise.UpdatePolicyTransaction.verify|verify} messages.
         * @param message UpdatePolicyTransaction message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: wavesenterprise.IUpdatePolicyTransaction, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes an UpdatePolicyTransaction message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns UpdatePolicyTransaction
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): wavesenterprise.UpdatePolicyTransaction;

        /**
         * Decodes an UpdatePolicyTransaction message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns UpdatePolicyTransaction
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): wavesenterprise.UpdatePolicyTransaction;

        /**
         * Verifies an UpdatePolicyTransaction message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates an UpdatePolicyTransaction message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns UpdatePolicyTransaction
         */
        public static fromObject(object: { [k: string]: any }): wavesenterprise.UpdatePolicyTransaction;

        /**
         * Creates a plain object from an UpdatePolicyTransaction message. Also converts values to other types if specified.
         * @param message UpdatePolicyTransaction
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: wavesenterprise.UpdatePolicyTransaction, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this UpdatePolicyTransaction to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a PolicyDataHashTransaction. */
    interface IPolicyDataHashTransaction {

        /** PolicyDataHashTransaction id */
        id?: (Uint8Array|null);

        /** PolicyDataHashTransaction senderPublicKey */
        senderPublicKey?: (Uint8Array|null);

        /** PolicyDataHashTransaction dataHash */
        dataHash?: (Uint8Array|null);

        /** PolicyDataHashTransaction policyId */
        policyId?: (Uint8Array|null);

        /** PolicyDataHashTransaction timestamp */
        timestamp?: (number|Long|null);

        /** PolicyDataHashTransaction fee */
        fee?: (number|Long|null);

        /** PolicyDataHashTransaction feeAssetId */
        feeAssetId?: (google.protobuf.IBytesValue|null);

        /** PolicyDataHashTransaction atomicBadge */
        atomicBadge?: (wavesenterprise.IAtomicBadge|null);

        /** PolicyDataHashTransaction proofs */
        proofs?: (Uint8Array[]|null);
    }

    /** Represents a PolicyDataHashTransaction. */
    class PolicyDataHashTransaction implements IPolicyDataHashTransaction {

        /**
         * Constructs a new PolicyDataHashTransaction.
         * @param [properties] Properties to set
         */
        constructor(properties?: wavesenterprise.IPolicyDataHashTransaction);

        /** PolicyDataHashTransaction id. */
        public id: Uint8Array;

        /** PolicyDataHashTransaction senderPublicKey. */
        public senderPublicKey: Uint8Array;

        /** PolicyDataHashTransaction dataHash. */
        public dataHash: Uint8Array;

        /** PolicyDataHashTransaction policyId. */
        public policyId: Uint8Array;

        /** PolicyDataHashTransaction timestamp. */
        public timestamp: (number|Long);

        /** PolicyDataHashTransaction fee. */
        public fee: (number|Long);

        /** PolicyDataHashTransaction feeAssetId. */
        public feeAssetId?: (google.protobuf.IBytesValue|null);

        /** PolicyDataHashTransaction atomicBadge. */
        public atomicBadge?: (wavesenterprise.IAtomicBadge|null);

        /** PolicyDataHashTransaction proofs. */
        public proofs: Uint8Array[];

        /**
         * Creates a new PolicyDataHashTransaction instance using the specified properties.
         * @param [properties] Properties to set
         * @returns PolicyDataHashTransaction instance
         */
        public static create(properties?: wavesenterprise.IPolicyDataHashTransaction): wavesenterprise.PolicyDataHashTransaction;

        /**
         * Encodes the specified PolicyDataHashTransaction message. Does not implicitly {@link wavesenterprise.PolicyDataHashTransaction.verify|verify} messages.
         * @param message PolicyDataHashTransaction message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: wavesenterprise.IPolicyDataHashTransaction, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified PolicyDataHashTransaction message, length delimited. Does not implicitly {@link wavesenterprise.PolicyDataHashTransaction.verify|verify} messages.
         * @param message PolicyDataHashTransaction message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: wavesenterprise.IPolicyDataHashTransaction, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a PolicyDataHashTransaction message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns PolicyDataHashTransaction
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): wavesenterprise.PolicyDataHashTransaction;

        /**
         * Decodes a PolicyDataHashTransaction message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns PolicyDataHashTransaction
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): wavesenterprise.PolicyDataHashTransaction;

        /**
         * Verifies a PolicyDataHashTransaction message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a PolicyDataHashTransaction message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns PolicyDataHashTransaction
         */
        public static fromObject(object: { [k: string]: any }): wavesenterprise.PolicyDataHashTransaction;

        /**
         * Creates a plain object from a PolicyDataHashTransaction message. Also converts values to other types if specified.
         * @param message PolicyDataHashTransaction
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: wavesenterprise.PolicyDataHashTransaction, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this PolicyDataHashTransaction to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a CreateContractTransaction. */
    interface ICreateContractTransaction {

        /** CreateContractTransaction id */
        id?: (Uint8Array|null);

        /** CreateContractTransaction senderPublicKey */
        senderPublicKey?: (Uint8Array|null);

        /** CreateContractTransaction image */
        image?: (string|null);

        /** CreateContractTransaction imageHash */
        imageHash?: (string|null);

        /** CreateContractTransaction contractName */
        contractName?: (string|null);

        /** CreateContractTransaction params */
        params?: (wavesenterprise.IDataEntry[]|null);

        /** CreateContractTransaction fee */
        fee?: (number|Long|null);

        /** CreateContractTransaction timestamp */
        timestamp?: (number|Long|null);

        /** CreateContractTransaction feeAssetId */
        feeAssetId?: (google.protobuf.IBytesValue|null);

        /** CreateContractTransaction atomicBadge */
        atomicBadge?: (wavesenterprise.IAtomicBadge|null);

        /** CreateContractTransaction validationPolicy */
        validationPolicy?: (wavesenterprise.IValidationPolicy|null);

        /** CreateContractTransaction apiVersion */
        apiVersion?: (wavesenterprise.IContractApiVersion|null);

        /** CreateContractTransaction proofs */
        proofs?: (Uint8Array[]|null);
    }

    /** Represents a CreateContractTransaction. */
    class CreateContractTransaction implements ICreateContractTransaction {

        /**
         * Constructs a new CreateContractTransaction.
         * @param [properties] Properties to set
         */
        constructor(properties?: wavesenterprise.ICreateContractTransaction);

        /** CreateContractTransaction id. */
        public id: Uint8Array;

        /** CreateContractTransaction senderPublicKey. */
        public senderPublicKey: Uint8Array;

        /** CreateContractTransaction image. */
        public image: string;

        /** CreateContractTransaction imageHash. */
        public imageHash: string;

        /** CreateContractTransaction contractName. */
        public contractName: string;

        /** CreateContractTransaction params. */
        public params: wavesenterprise.IDataEntry[];

        /** CreateContractTransaction fee. */
        public fee: (number|Long);

        /** CreateContractTransaction timestamp. */
        public timestamp: (number|Long);

        /** CreateContractTransaction feeAssetId. */
        public feeAssetId?: (google.protobuf.IBytesValue|null);

        /** CreateContractTransaction atomicBadge. */
        public atomicBadge?: (wavesenterprise.IAtomicBadge|null);

        /** CreateContractTransaction validationPolicy. */
        public validationPolicy?: (wavesenterprise.IValidationPolicy|null);

        /** CreateContractTransaction apiVersion. */
        public apiVersion?: (wavesenterprise.IContractApiVersion|null);

        /** CreateContractTransaction proofs. */
        public proofs: Uint8Array[];

        /**
         * Creates a new CreateContractTransaction instance using the specified properties.
         * @param [properties] Properties to set
         * @returns CreateContractTransaction instance
         */
        public static create(properties?: wavesenterprise.ICreateContractTransaction): wavesenterprise.CreateContractTransaction;

        /**
         * Encodes the specified CreateContractTransaction message. Does not implicitly {@link wavesenterprise.CreateContractTransaction.verify|verify} messages.
         * @param message CreateContractTransaction message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: wavesenterprise.ICreateContractTransaction, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified CreateContractTransaction message, length delimited. Does not implicitly {@link wavesenterprise.CreateContractTransaction.verify|verify} messages.
         * @param message CreateContractTransaction message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: wavesenterprise.ICreateContractTransaction, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a CreateContractTransaction message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns CreateContractTransaction
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): wavesenterprise.CreateContractTransaction;

        /**
         * Decodes a CreateContractTransaction message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns CreateContractTransaction
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): wavesenterprise.CreateContractTransaction;

        /**
         * Verifies a CreateContractTransaction message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a CreateContractTransaction message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns CreateContractTransaction
         */
        public static fromObject(object: { [k: string]: any }): wavesenterprise.CreateContractTransaction;

        /**
         * Creates a plain object from a CreateContractTransaction message. Also converts values to other types if specified.
         * @param message CreateContractTransaction
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: wavesenterprise.CreateContractTransaction, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this CreateContractTransaction to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a ContractApiVersion. */
    interface IContractApiVersion {

        /** ContractApiVersion majorVersion */
        majorVersion?: (number|null);

        /** ContractApiVersion minorVersion */
        minorVersion?: (number|null);
    }

    /** Represents a ContractApiVersion. */
    class ContractApiVersion implements IContractApiVersion {

        /**
         * Constructs a new ContractApiVersion.
         * @param [properties] Properties to set
         */
        constructor(properties?: wavesenterprise.IContractApiVersion);

        /** ContractApiVersion majorVersion. */
        public majorVersion: number;

        /** ContractApiVersion minorVersion. */
        public minorVersion: number;

        /**
         * Creates a new ContractApiVersion instance using the specified properties.
         * @param [properties] Properties to set
         * @returns ContractApiVersion instance
         */
        public static create(properties?: wavesenterprise.IContractApiVersion): wavesenterprise.ContractApiVersion;

        /**
         * Encodes the specified ContractApiVersion message. Does not implicitly {@link wavesenterprise.ContractApiVersion.verify|verify} messages.
         * @param message ContractApiVersion message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: wavesenterprise.IContractApiVersion, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified ContractApiVersion message, length delimited. Does not implicitly {@link wavesenterprise.ContractApiVersion.verify|verify} messages.
         * @param message ContractApiVersion message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: wavesenterprise.IContractApiVersion, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a ContractApiVersion message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns ContractApiVersion
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): wavesenterprise.ContractApiVersion;

        /**
         * Decodes a ContractApiVersion message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns ContractApiVersion
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): wavesenterprise.ContractApiVersion;

        /**
         * Verifies a ContractApiVersion message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a ContractApiVersion message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns ContractApiVersion
         */
        public static fromObject(object: { [k: string]: any }): wavesenterprise.ContractApiVersion;

        /**
         * Creates a plain object from a ContractApiVersion message. Also converts values to other types if specified.
         * @param message ContractApiVersion
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: wavesenterprise.ContractApiVersion, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this ContractApiVersion to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a ValidationPolicy. */
    interface IValidationPolicy {

        /** ValidationPolicy any */
        any?: (wavesenterprise.ValidationPolicy.IAny|null);

        /** ValidationPolicy majority */
        majority?: (wavesenterprise.ValidationPolicy.IMajority|null);

        /** ValidationPolicy majorityWithOneOf */
        majorityWithOneOf?: (wavesenterprise.ValidationPolicy.IMajorityWithOneOf|null);
    }

    /** Represents a ValidationPolicy. */
    class ValidationPolicy implements IValidationPolicy {

        /**
         * Constructs a new ValidationPolicy.
         * @param [properties] Properties to set
         */
        constructor(properties?: wavesenterprise.IValidationPolicy);

        /** ValidationPolicy any. */
        public any?: (wavesenterprise.ValidationPolicy.IAny|null);

        /** ValidationPolicy majority. */
        public majority?: (wavesenterprise.ValidationPolicy.IMajority|null);

        /** ValidationPolicy majorityWithOneOf. */
        public majorityWithOneOf?: (wavesenterprise.ValidationPolicy.IMajorityWithOneOf|null);

        /** ValidationPolicy type. */
        public type?: ("any"|"majority"|"majorityWithOneOf");

        /**
         * Creates a new ValidationPolicy instance using the specified properties.
         * @param [properties] Properties to set
         * @returns ValidationPolicy instance
         */
        public static create(properties?: wavesenterprise.IValidationPolicy): wavesenterprise.ValidationPolicy;

        /**
         * Encodes the specified ValidationPolicy message. Does not implicitly {@link wavesenterprise.ValidationPolicy.verify|verify} messages.
         * @param message ValidationPolicy message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: wavesenterprise.IValidationPolicy, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified ValidationPolicy message, length delimited. Does not implicitly {@link wavesenterprise.ValidationPolicy.verify|verify} messages.
         * @param message ValidationPolicy message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: wavesenterprise.IValidationPolicy, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a ValidationPolicy message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns ValidationPolicy
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): wavesenterprise.ValidationPolicy;

        /**
         * Decodes a ValidationPolicy message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns ValidationPolicy
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): wavesenterprise.ValidationPolicy;

        /**
         * Verifies a ValidationPolicy message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a ValidationPolicy message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns ValidationPolicy
         */
        public static fromObject(object: { [k: string]: any }): wavesenterprise.ValidationPolicy;

        /**
         * Creates a plain object from a ValidationPolicy message. Also converts values to other types if specified.
         * @param message ValidationPolicy
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: wavesenterprise.ValidationPolicy, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this ValidationPolicy to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    namespace ValidationPolicy {

        /** Properties of an Any. */
        interface IAny {
        }

        /** Represents an Any. */
        class Any implements IAny {

            /**
             * Constructs a new Any.
             * @param [properties] Properties to set
             */
            constructor(properties?: wavesenterprise.ValidationPolicy.IAny);

            /**
             * Creates a new Any instance using the specified properties.
             * @param [properties] Properties to set
             * @returns Any instance
             */
            public static create(properties?: wavesenterprise.ValidationPolicy.IAny): wavesenterprise.ValidationPolicy.Any;

            /**
             * Encodes the specified Any message. Does not implicitly {@link wavesenterprise.ValidationPolicy.Any.verify|verify} messages.
             * @param message Any message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: wavesenterprise.ValidationPolicy.IAny, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified Any message, length delimited. Does not implicitly {@link wavesenterprise.ValidationPolicy.Any.verify|verify} messages.
             * @param message Any message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: wavesenterprise.ValidationPolicy.IAny, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes an Any message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns Any
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): wavesenterprise.ValidationPolicy.Any;

            /**
             * Decodes an Any message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns Any
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): wavesenterprise.ValidationPolicy.Any;

            /**
             * Verifies an Any message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates an Any message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns Any
             */
            public static fromObject(object: { [k: string]: any }): wavesenterprise.ValidationPolicy.Any;

            /**
             * Creates a plain object from an Any message. Also converts values to other types if specified.
             * @param message Any
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: wavesenterprise.ValidationPolicy.Any, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this Any to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };
        }

        /** Properties of a Majority. */
        interface IMajority {
        }

        /** Represents a Majority. */
        class Majority implements IMajority {

            /**
             * Constructs a new Majority.
             * @param [properties] Properties to set
             */
            constructor(properties?: wavesenterprise.ValidationPolicy.IMajority);

            /**
             * Creates a new Majority instance using the specified properties.
             * @param [properties] Properties to set
             * @returns Majority instance
             */
            public static create(properties?: wavesenterprise.ValidationPolicy.IMajority): wavesenterprise.ValidationPolicy.Majority;

            /**
             * Encodes the specified Majority message. Does not implicitly {@link wavesenterprise.ValidationPolicy.Majority.verify|verify} messages.
             * @param message Majority message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: wavesenterprise.ValidationPolicy.IMajority, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified Majority message, length delimited. Does not implicitly {@link wavesenterprise.ValidationPolicy.Majority.verify|verify} messages.
             * @param message Majority message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: wavesenterprise.ValidationPolicy.IMajority, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a Majority message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns Majority
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): wavesenterprise.ValidationPolicy.Majority;

            /**
             * Decodes a Majority message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns Majority
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): wavesenterprise.ValidationPolicy.Majority;

            /**
             * Verifies a Majority message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a Majority message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns Majority
             */
            public static fromObject(object: { [k: string]: any }): wavesenterprise.ValidationPolicy.Majority;

            /**
             * Creates a plain object from a Majority message. Also converts values to other types if specified.
             * @param message Majority
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: wavesenterprise.ValidationPolicy.Majority, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this Majority to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };
        }

        /** Properties of a MajorityWithOneOf. */
        interface IMajorityWithOneOf {

            /** MajorityWithOneOf addresses */
            addresses?: (Uint8Array[]|null);
        }

        /** Represents a MajorityWithOneOf. */
        class MajorityWithOneOf implements IMajorityWithOneOf {

            /**
             * Constructs a new MajorityWithOneOf.
             * @param [properties] Properties to set
             */
            constructor(properties?: wavesenterprise.ValidationPolicy.IMajorityWithOneOf);

            /** MajorityWithOneOf addresses. */
            public addresses: Uint8Array[];

            /**
             * Creates a new MajorityWithOneOf instance using the specified properties.
             * @param [properties] Properties to set
             * @returns MajorityWithOneOf instance
             */
            public static create(properties?: wavesenterprise.ValidationPolicy.IMajorityWithOneOf): wavesenterprise.ValidationPolicy.MajorityWithOneOf;

            /**
             * Encodes the specified MajorityWithOneOf message. Does not implicitly {@link wavesenterprise.ValidationPolicy.MajorityWithOneOf.verify|verify} messages.
             * @param message MajorityWithOneOf message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: wavesenterprise.ValidationPolicy.IMajorityWithOneOf, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified MajorityWithOneOf message, length delimited. Does not implicitly {@link wavesenterprise.ValidationPolicy.MajorityWithOneOf.verify|verify} messages.
             * @param message MajorityWithOneOf message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: wavesenterprise.ValidationPolicy.IMajorityWithOneOf, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a MajorityWithOneOf message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns MajorityWithOneOf
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): wavesenterprise.ValidationPolicy.MajorityWithOneOf;

            /**
             * Decodes a MajorityWithOneOf message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns MajorityWithOneOf
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): wavesenterprise.ValidationPolicy.MajorityWithOneOf;

            /**
             * Verifies a MajorityWithOneOf message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a MajorityWithOneOf message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns MajorityWithOneOf
             */
            public static fromObject(object: { [k: string]: any }): wavesenterprise.ValidationPolicy.MajorityWithOneOf;

            /**
             * Creates a plain object from a MajorityWithOneOf message. Also converts values to other types if specified.
             * @param message MajorityWithOneOf
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: wavesenterprise.ValidationPolicy.MajorityWithOneOf, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this MajorityWithOneOf to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };
        }
    }

    /** Properties of a CallContractTransaction. */
    interface ICallContractTransaction {

        /** CallContractTransaction id */
        id?: (Uint8Array|null);

        /** CallContractTransaction senderPublicKey */
        senderPublicKey?: (Uint8Array|null);

        /** CallContractTransaction contractId */
        contractId?: (Uint8Array|null);

        /** CallContractTransaction params */
        params?: (wavesenterprise.IDataEntry[]|null);

        /** CallContractTransaction fee */
        fee?: (number|Long|null);

        /** CallContractTransaction timestamp */
        timestamp?: (number|Long|null);

        /** CallContractTransaction contractVersion */
        contractVersion?: (number|null);

        /** CallContractTransaction feeAssetId */
        feeAssetId?: (google.protobuf.IBytesValue|null);

        /** CallContractTransaction atomicBadge */
        atomicBadge?: (wavesenterprise.IAtomicBadge|null);

        /** CallContractTransaction proofs */
        proofs?: (Uint8Array[]|null);
    }

    /** Represents a CallContractTransaction. */
    class CallContractTransaction implements ICallContractTransaction {

        /**
         * Constructs a new CallContractTransaction.
         * @param [properties] Properties to set
         */
        constructor(properties?: wavesenterprise.ICallContractTransaction);

        /** CallContractTransaction id. */
        public id: Uint8Array;

        /** CallContractTransaction senderPublicKey. */
        public senderPublicKey: Uint8Array;

        /** CallContractTransaction contractId. */
        public contractId: Uint8Array;

        /** CallContractTransaction params. */
        public params: wavesenterprise.IDataEntry[];

        /** CallContractTransaction fee. */
        public fee: (number|Long);

        /** CallContractTransaction timestamp. */
        public timestamp: (number|Long);

        /** CallContractTransaction contractVersion. */
        public contractVersion: number;

        /** CallContractTransaction feeAssetId. */
        public feeAssetId?: (google.protobuf.IBytesValue|null);

        /** CallContractTransaction atomicBadge. */
        public atomicBadge?: (wavesenterprise.IAtomicBadge|null);

        /** CallContractTransaction proofs. */
        public proofs: Uint8Array[];

        /**
         * Creates a new CallContractTransaction instance using the specified properties.
         * @param [properties] Properties to set
         * @returns CallContractTransaction instance
         */
        public static create(properties?: wavesenterprise.ICallContractTransaction): wavesenterprise.CallContractTransaction;

        /**
         * Encodes the specified CallContractTransaction message. Does not implicitly {@link wavesenterprise.CallContractTransaction.verify|verify} messages.
         * @param message CallContractTransaction message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: wavesenterprise.ICallContractTransaction, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified CallContractTransaction message, length delimited. Does not implicitly {@link wavesenterprise.CallContractTransaction.verify|verify} messages.
         * @param message CallContractTransaction message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: wavesenterprise.ICallContractTransaction, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a CallContractTransaction message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns CallContractTransaction
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): wavesenterprise.CallContractTransaction;

        /**
         * Decodes a CallContractTransaction message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns CallContractTransaction
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): wavesenterprise.CallContractTransaction;

        /**
         * Verifies a CallContractTransaction message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a CallContractTransaction message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns CallContractTransaction
         */
        public static fromObject(object: { [k: string]: any }): wavesenterprise.CallContractTransaction;

        /**
         * Creates a plain object from a CallContractTransaction message. Also converts values to other types if specified.
         * @param message CallContractTransaction
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: wavesenterprise.CallContractTransaction, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this CallContractTransaction to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of an ExecutedContractTransaction. */
    interface IExecutedContractTransaction {

        /** ExecutedContractTransaction id */
        id?: (Uint8Array|null);

        /** ExecutedContractTransaction senderPublicKey */
        senderPublicKey?: (Uint8Array|null);

        /** ExecutedContractTransaction tx */
        tx?: (wavesenterprise.IExecutableTransaction|null);

        /** ExecutedContractTransaction results */
        results?: (wavesenterprise.IDataEntry[]|null);

        /** ExecutedContractTransaction resultsHash */
        resultsHash?: (Uint8Array|null);

        /** ExecutedContractTransaction validationProofs */
        validationProofs?: (wavesenterprise.IValidationProof[]|null);

        /** ExecutedContractTransaction timestamp */
        timestamp?: (number|Long|null);

        /** ExecutedContractTransaction proofs */
        proofs?: (Uint8Array[]|null);
    }

    /** Represents an ExecutedContractTransaction. */
    class ExecutedContractTransaction implements IExecutedContractTransaction {

        /**
         * Constructs a new ExecutedContractTransaction.
         * @param [properties] Properties to set
         */
        constructor(properties?: wavesenterprise.IExecutedContractTransaction);

        /** ExecutedContractTransaction id. */
        public id: Uint8Array;

        /** ExecutedContractTransaction senderPublicKey. */
        public senderPublicKey: Uint8Array;

        /** ExecutedContractTransaction tx. */
        public tx?: (wavesenterprise.IExecutableTransaction|null);

        /** ExecutedContractTransaction results. */
        public results: wavesenterprise.IDataEntry[];

        /** ExecutedContractTransaction resultsHash. */
        public resultsHash: Uint8Array;

        /** ExecutedContractTransaction validationProofs. */
        public validationProofs: wavesenterprise.IValidationProof[];

        /** ExecutedContractTransaction timestamp. */
        public timestamp: (number|Long);

        /** ExecutedContractTransaction proofs. */
        public proofs: Uint8Array[];

        /**
         * Creates a new ExecutedContractTransaction instance using the specified properties.
         * @param [properties] Properties to set
         * @returns ExecutedContractTransaction instance
         */
        public static create(properties?: wavesenterprise.IExecutedContractTransaction): wavesenterprise.ExecutedContractTransaction;

        /**
         * Encodes the specified ExecutedContractTransaction message. Does not implicitly {@link wavesenterprise.ExecutedContractTransaction.verify|verify} messages.
         * @param message ExecutedContractTransaction message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: wavesenterprise.IExecutedContractTransaction, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified ExecutedContractTransaction message, length delimited. Does not implicitly {@link wavesenterprise.ExecutedContractTransaction.verify|verify} messages.
         * @param message ExecutedContractTransaction message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: wavesenterprise.IExecutedContractTransaction, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes an ExecutedContractTransaction message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns ExecutedContractTransaction
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): wavesenterprise.ExecutedContractTransaction;

        /**
         * Decodes an ExecutedContractTransaction message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns ExecutedContractTransaction
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): wavesenterprise.ExecutedContractTransaction;

        /**
         * Verifies an ExecutedContractTransaction message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates an ExecutedContractTransaction message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns ExecutedContractTransaction
         */
        public static fromObject(object: { [k: string]: any }): wavesenterprise.ExecutedContractTransaction;

        /**
         * Creates a plain object from an ExecutedContractTransaction message. Also converts values to other types if specified.
         * @param message ExecutedContractTransaction
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: wavesenterprise.ExecutedContractTransaction, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this ExecutedContractTransaction to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of an ExecutableTransaction. */
    interface IExecutableTransaction {

        /** ExecutableTransaction version */
        version?: (number|null);

        /** ExecutableTransaction createContractTransaction */
        createContractTransaction?: (wavesenterprise.ICreateContractTransaction|null);

        /** ExecutableTransaction callContractTransaction */
        callContractTransaction?: (wavesenterprise.ICallContractTransaction|null);

        /** ExecutableTransaction updateContractTransaction */
        updateContractTransaction?: (wavesenterprise.IUpdateContractTransaction|null);
    }

    /** Represents an ExecutableTransaction. */
    class ExecutableTransaction implements IExecutableTransaction {

        /**
         * Constructs a new ExecutableTransaction.
         * @param [properties] Properties to set
         */
        constructor(properties?: wavesenterprise.IExecutableTransaction);

        /** ExecutableTransaction version. */
        public version: number;

        /** ExecutableTransaction createContractTransaction. */
        public createContractTransaction?: (wavesenterprise.ICreateContractTransaction|null);

        /** ExecutableTransaction callContractTransaction. */
        public callContractTransaction?: (wavesenterprise.ICallContractTransaction|null);

        /** ExecutableTransaction updateContractTransaction. */
        public updateContractTransaction?: (wavesenterprise.IUpdateContractTransaction|null);

        /** ExecutableTransaction transaction. */
        public transaction?: ("createContractTransaction"|"callContractTransaction"|"updateContractTransaction");

        /**
         * Creates a new ExecutableTransaction instance using the specified properties.
         * @param [properties] Properties to set
         * @returns ExecutableTransaction instance
         */
        public static create(properties?: wavesenterprise.IExecutableTransaction): wavesenterprise.ExecutableTransaction;

        /**
         * Encodes the specified ExecutableTransaction message. Does not implicitly {@link wavesenterprise.ExecutableTransaction.verify|verify} messages.
         * @param message ExecutableTransaction message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: wavesenterprise.IExecutableTransaction, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified ExecutableTransaction message, length delimited. Does not implicitly {@link wavesenterprise.ExecutableTransaction.verify|verify} messages.
         * @param message ExecutableTransaction message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: wavesenterprise.IExecutableTransaction, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes an ExecutableTransaction message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns ExecutableTransaction
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): wavesenterprise.ExecutableTransaction;

        /**
         * Decodes an ExecutableTransaction message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns ExecutableTransaction
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): wavesenterprise.ExecutableTransaction;

        /**
         * Verifies an ExecutableTransaction message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates an ExecutableTransaction message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns ExecutableTransaction
         */
        public static fromObject(object: { [k: string]: any }): wavesenterprise.ExecutableTransaction;

        /**
         * Creates a plain object from an ExecutableTransaction message. Also converts values to other types if specified.
         * @param message ExecutableTransaction
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: wavesenterprise.ExecutableTransaction, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this ExecutableTransaction to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of an UpdateContractTransaction. */
    interface IUpdateContractTransaction {

        /** UpdateContractTransaction id */
        id?: (Uint8Array|null);

        /** UpdateContractTransaction senderPublicKey */
        senderPublicKey?: (Uint8Array|null);

        /** UpdateContractTransaction contractId */
        contractId?: (Uint8Array|null);

        /** UpdateContractTransaction image */
        image?: (string|null);

        /** UpdateContractTransaction imageHash */
        imageHash?: (string|null);

        /** UpdateContractTransaction fee */
        fee?: (number|Long|null);

        /** UpdateContractTransaction timestamp */
        timestamp?: (number|Long|null);

        /** UpdateContractTransaction feeAssetId */
        feeAssetId?: (google.protobuf.IBytesValue|null);

        /** UpdateContractTransaction atomicBadge */
        atomicBadge?: (wavesenterprise.IAtomicBadge|null);

        /** UpdateContractTransaction validationPolicy */
        validationPolicy?: (wavesenterprise.IValidationPolicy|null);

        /** UpdateContractTransaction apiVersion */
        apiVersion?: (wavesenterprise.IContractApiVersion|null);

        /** UpdateContractTransaction proofs */
        proofs?: (Uint8Array[]|null);
    }

    /** Represents an UpdateContractTransaction. */
    class UpdateContractTransaction implements IUpdateContractTransaction {

        /**
         * Constructs a new UpdateContractTransaction.
         * @param [properties] Properties to set
         */
        constructor(properties?: wavesenterprise.IUpdateContractTransaction);

        /** UpdateContractTransaction id. */
        public id: Uint8Array;

        /** UpdateContractTransaction senderPublicKey. */
        public senderPublicKey: Uint8Array;

        /** UpdateContractTransaction contractId. */
        public contractId: Uint8Array;

        /** UpdateContractTransaction image. */
        public image: string;

        /** UpdateContractTransaction imageHash. */
        public imageHash: string;

        /** UpdateContractTransaction fee. */
        public fee: (number|Long);

        /** UpdateContractTransaction timestamp. */
        public timestamp: (number|Long);

        /** UpdateContractTransaction feeAssetId. */
        public feeAssetId?: (google.protobuf.IBytesValue|null);

        /** UpdateContractTransaction atomicBadge. */
        public atomicBadge?: (wavesenterprise.IAtomicBadge|null);

        /** UpdateContractTransaction validationPolicy. */
        public validationPolicy?: (wavesenterprise.IValidationPolicy|null);

        /** UpdateContractTransaction apiVersion. */
        public apiVersion?: (wavesenterprise.IContractApiVersion|null);

        /** UpdateContractTransaction proofs. */
        public proofs: Uint8Array[];

        /**
         * Creates a new UpdateContractTransaction instance using the specified properties.
         * @param [properties] Properties to set
         * @returns UpdateContractTransaction instance
         */
        public static create(properties?: wavesenterprise.IUpdateContractTransaction): wavesenterprise.UpdateContractTransaction;

        /**
         * Encodes the specified UpdateContractTransaction message. Does not implicitly {@link wavesenterprise.UpdateContractTransaction.verify|verify} messages.
         * @param message UpdateContractTransaction message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: wavesenterprise.IUpdateContractTransaction, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified UpdateContractTransaction message, length delimited. Does not implicitly {@link wavesenterprise.UpdateContractTransaction.verify|verify} messages.
         * @param message UpdateContractTransaction message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: wavesenterprise.IUpdateContractTransaction, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes an UpdateContractTransaction message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns UpdateContractTransaction
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): wavesenterprise.UpdateContractTransaction;

        /**
         * Decodes an UpdateContractTransaction message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns UpdateContractTransaction
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): wavesenterprise.UpdateContractTransaction;

        /**
         * Verifies an UpdateContractTransaction message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates an UpdateContractTransaction message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns UpdateContractTransaction
         */
        public static fromObject(object: { [k: string]: any }): wavesenterprise.UpdateContractTransaction;

        /**
         * Creates a plain object from an UpdateContractTransaction message. Also converts values to other types if specified.
         * @param message UpdateContractTransaction
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: wavesenterprise.UpdateContractTransaction, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this UpdateContractTransaction to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a ValidationProof. */
    interface IValidationProof {

        /** ValidationProof validatorPublicKey */
        validatorPublicKey?: (Uint8Array|null);

        /** ValidationProof signature */
        signature?: (Uint8Array|null);
    }

    /** Represents a ValidationProof. */
    class ValidationProof implements IValidationProof {

        /**
         * Constructs a new ValidationProof.
         * @param [properties] Properties to set
         */
        constructor(properties?: wavesenterprise.IValidationProof);

        /** ValidationProof validatorPublicKey. */
        public validatorPublicKey: Uint8Array;

        /** ValidationProof signature. */
        public signature: Uint8Array;

        /**
         * Creates a new ValidationProof instance using the specified properties.
         * @param [properties] Properties to set
         * @returns ValidationProof instance
         */
        public static create(properties?: wavesenterprise.IValidationProof): wavesenterprise.ValidationProof;

        /**
         * Encodes the specified ValidationProof message. Does not implicitly {@link wavesenterprise.ValidationProof.verify|verify} messages.
         * @param message ValidationProof message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: wavesenterprise.IValidationProof, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified ValidationProof message, length delimited. Does not implicitly {@link wavesenterprise.ValidationProof.verify|verify} messages.
         * @param message ValidationProof message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: wavesenterprise.IValidationProof, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a ValidationProof message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns ValidationProof
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): wavesenterprise.ValidationProof;

        /**
         * Decodes a ValidationProof message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns ValidationProof
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): wavesenterprise.ValidationProof;

        /**
         * Verifies a ValidationProof message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a ValidationProof message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns ValidationProof
         */
        public static fromObject(object: { [k: string]: any }): wavesenterprise.ValidationProof;

        /**
         * Creates a plain object from a ValidationProof message. Also converts values to other types if specified.
         * @param message ValidationProof
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: wavesenterprise.ValidationProof, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this ValidationProof to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a DisableContractTransaction. */
    interface IDisableContractTransaction {

        /** DisableContractTransaction id */
        id?: (Uint8Array|null);

        /** DisableContractTransaction senderPublicKey */
        senderPublicKey?: (Uint8Array|null);

        /** DisableContractTransaction contractId */
        contractId?: (Uint8Array|null);

        /** DisableContractTransaction fee */
        fee?: (number|Long|null);

        /** DisableContractTransaction timestamp */
        timestamp?: (number|Long|null);

        /** DisableContractTransaction feeAssetId */
        feeAssetId?: (google.protobuf.IBytesValue|null);

        /** DisableContractTransaction atomicBadge */
        atomicBadge?: (wavesenterprise.IAtomicBadge|null);

        /** DisableContractTransaction proofs */
        proofs?: (Uint8Array[]|null);
    }

    /** Represents a DisableContractTransaction. */
    class DisableContractTransaction implements IDisableContractTransaction {

        /**
         * Constructs a new DisableContractTransaction.
         * @param [properties] Properties to set
         */
        constructor(properties?: wavesenterprise.IDisableContractTransaction);

        /** DisableContractTransaction id. */
        public id: Uint8Array;

        /** DisableContractTransaction senderPublicKey. */
        public senderPublicKey: Uint8Array;

        /** DisableContractTransaction contractId. */
        public contractId: Uint8Array;

        /** DisableContractTransaction fee. */
        public fee: (number|Long);

        /** DisableContractTransaction timestamp. */
        public timestamp: (number|Long);

        /** DisableContractTransaction feeAssetId. */
        public feeAssetId?: (google.protobuf.IBytesValue|null);

        /** DisableContractTransaction atomicBadge. */
        public atomicBadge?: (wavesenterprise.IAtomicBadge|null);

        /** DisableContractTransaction proofs. */
        public proofs: Uint8Array[];

        /**
         * Creates a new DisableContractTransaction instance using the specified properties.
         * @param [properties] Properties to set
         * @returns DisableContractTransaction instance
         */
        public static create(properties?: wavesenterprise.IDisableContractTransaction): wavesenterprise.DisableContractTransaction;

        /**
         * Encodes the specified DisableContractTransaction message. Does not implicitly {@link wavesenterprise.DisableContractTransaction.verify|verify} messages.
         * @param message DisableContractTransaction message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: wavesenterprise.IDisableContractTransaction, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified DisableContractTransaction message, length delimited. Does not implicitly {@link wavesenterprise.DisableContractTransaction.verify|verify} messages.
         * @param message DisableContractTransaction message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: wavesenterprise.IDisableContractTransaction, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a DisableContractTransaction message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns DisableContractTransaction
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): wavesenterprise.DisableContractTransaction;

        /**
         * Decodes a DisableContractTransaction message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns DisableContractTransaction
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): wavesenterprise.DisableContractTransaction;

        /**
         * Verifies a DisableContractTransaction message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a DisableContractTransaction message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns DisableContractTransaction
         */
        public static fromObject(object: { [k: string]: any }): wavesenterprise.DisableContractTransaction;

        /**
         * Creates a plain object from a DisableContractTransaction message. Also converts values to other types if specified.
         * @param message DisableContractTransaction
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: wavesenterprise.DisableContractTransaction, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this DisableContractTransaction to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a SetScriptTransaction. */
    interface ISetScriptTransaction {

        /** SetScriptTransaction id */
        id?: (Uint8Array|null);

        /** SetScriptTransaction chainId */
        chainId?: (number|null);

        /** SetScriptTransaction senderPublicKey */
        senderPublicKey?: (Uint8Array|null);

        /** SetScriptTransaction script */
        script?: (google.protobuf.IBytesValue|null);

        /** SetScriptTransaction name */
        name?: (Uint8Array|null);

        /** SetScriptTransaction description */
        description?: (Uint8Array|null);

        /** SetScriptTransaction fee */
        fee?: (number|Long|null);

        /** SetScriptTransaction timestamp */
        timestamp?: (number|Long|null);

        /** SetScriptTransaction proofs */
        proofs?: (Uint8Array[]|null);
    }

    /** Represents a SetScriptTransaction. */
    class SetScriptTransaction implements ISetScriptTransaction {

        /**
         * Constructs a new SetScriptTransaction.
         * @param [properties] Properties to set
         */
        constructor(properties?: wavesenterprise.ISetScriptTransaction);

        /** SetScriptTransaction id. */
        public id: Uint8Array;

        /** SetScriptTransaction chainId. */
        public chainId: number;

        /** SetScriptTransaction senderPublicKey. */
        public senderPublicKey: Uint8Array;

        /** SetScriptTransaction script. */
        public script?: (google.protobuf.IBytesValue|null);

        /** SetScriptTransaction name. */
        public name: Uint8Array;

        /** SetScriptTransaction description. */
        public description: Uint8Array;

        /** SetScriptTransaction fee. */
        public fee: (number|Long);

        /** SetScriptTransaction timestamp. */
        public timestamp: (number|Long);

        /** SetScriptTransaction proofs. */
        public proofs: Uint8Array[];

        /**
         * Creates a new SetScriptTransaction instance using the specified properties.
         * @param [properties] Properties to set
         * @returns SetScriptTransaction instance
         */
        public static create(properties?: wavesenterprise.ISetScriptTransaction): wavesenterprise.SetScriptTransaction;

        /**
         * Encodes the specified SetScriptTransaction message. Does not implicitly {@link wavesenterprise.SetScriptTransaction.verify|verify} messages.
         * @param message SetScriptTransaction message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: wavesenterprise.ISetScriptTransaction, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified SetScriptTransaction message, length delimited. Does not implicitly {@link wavesenterprise.SetScriptTransaction.verify|verify} messages.
         * @param message SetScriptTransaction message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: wavesenterprise.ISetScriptTransaction, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a SetScriptTransaction message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns SetScriptTransaction
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): wavesenterprise.SetScriptTransaction;

        /**
         * Decodes a SetScriptTransaction message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns SetScriptTransaction
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): wavesenterprise.SetScriptTransaction;

        /**
         * Verifies a SetScriptTransaction message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a SetScriptTransaction message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns SetScriptTransaction
         */
        public static fromObject(object: { [k: string]: any }): wavesenterprise.SetScriptTransaction;

        /**
         * Creates a plain object from a SetScriptTransaction message. Also converts values to other types if specified.
         * @param message SetScriptTransaction
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: wavesenterprise.SetScriptTransaction, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this SetScriptTransaction to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of an AtomicTransaction. */
    interface IAtomicTransaction {

        /** AtomicTransaction id */
        id?: (Uint8Array|null);

        /** AtomicTransaction senderPublicKey */
        senderPublicKey?: (Uint8Array|null);

        /** AtomicTransaction miner */
        miner?: (google.protobuf.IBytesValue|null);

        /** AtomicTransaction transactions */
        transactions?: (wavesenterprise.IAtomicInnerTransaction[]|null);

        /** AtomicTransaction timestamp */
        timestamp?: (number|Long|null);

        /** AtomicTransaction proofs */
        proofs?: (Uint8Array[]|null);
    }

    /** Represents an AtomicTransaction. */
    class AtomicTransaction implements IAtomicTransaction {

        /**
         * Constructs a new AtomicTransaction.
         * @param [properties] Properties to set
         */
        constructor(properties?: wavesenterprise.IAtomicTransaction);

        /** AtomicTransaction id. */
        public id: Uint8Array;

        /** AtomicTransaction senderPublicKey. */
        public senderPublicKey: Uint8Array;

        /** AtomicTransaction miner. */
        public miner?: (google.protobuf.IBytesValue|null);

        /** AtomicTransaction transactions. */
        public transactions: wavesenterprise.IAtomicInnerTransaction[];

        /** AtomicTransaction timestamp. */
        public timestamp: (number|Long);

        /** AtomicTransaction proofs. */
        public proofs: Uint8Array[];

        /**
         * Creates a new AtomicTransaction instance using the specified properties.
         * @param [properties] Properties to set
         * @returns AtomicTransaction instance
         */
        public static create(properties?: wavesenterprise.IAtomicTransaction): wavesenterprise.AtomicTransaction;

        /**
         * Encodes the specified AtomicTransaction message. Does not implicitly {@link wavesenterprise.AtomicTransaction.verify|verify} messages.
         * @param message AtomicTransaction message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: wavesenterprise.IAtomicTransaction, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified AtomicTransaction message, length delimited. Does not implicitly {@link wavesenterprise.AtomicTransaction.verify|verify} messages.
         * @param message AtomicTransaction message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: wavesenterprise.IAtomicTransaction, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes an AtomicTransaction message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns AtomicTransaction
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): wavesenterprise.AtomicTransaction;

        /**
         * Decodes an AtomicTransaction message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns AtomicTransaction
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): wavesenterprise.AtomicTransaction;

        /**
         * Verifies an AtomicTransaction message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates an AtomicTransaction message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns AtomicTransaction
         */
        public static fromObject(object: { [k: string]: any }): wavesenterprise.AtomicTransaction;

        /**
         * Creates a plain object from an AtomicTransaction message. Also converts values to other types if specified.
         * @param message AtomicTransaction
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: wavesenterprise.AtomicTransaction, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this AtomicTransaction to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of an AtomicInnerTransaction. */
    interface IAtomicInnerTransaction {

        /** AtomicInnerTransaction version */
        version?: (number|null);

        /** AtomicInnerTransaction genesisTransaction */
        genesisTransaction?: (wavesenterprise.IGenesisTransaction|null);

        /** AtomicInnerTransaction genesisPermitTransaction */
        genesisPermitTransaction?: (wavesenterprise.IGenesisPermitTransaction|null);

        /** AtomicInnerTransaction genesisRegisterNodeTransaction */
        genesisRegisterNodeTransaction?: (wavesenterprise.IGenesisRegisterNodeTransaction|null);

        /** AtomicInnerTransaction registerNodeTransaction */
        registerNodeTransaction?: (wavesenterprise.IRegisterNodeTransaction|null);

        /** AtomicInnerTransaction createAliasTransaction */
        createAliasTransaction?: (wavesenterprise.ICreateAliasTransaction|null);

        /** AtomicInnerTransaction issueTransaction */
        issueTransaction?: (wavesenterprise.IIssueTransaction|null);

        /** AtomicInnerTransaction reissueTransaction */
        reissueTransaction?: (wavesenterprise.IReissueTransaction|null);

        /** AtomicInnerTransaction burnTransaction */
        burnTransaction?: (wavesenterprise.IBurnTransaction|null);

        /** AtomicInnerTransaction leaseTransaction */
        leaseTransaction?: (wavesenterprise.ILeaseTransaction|null);

        /** AtomicInnerTransaction leaseCancelTransaction */
        leaseCancelTransaction?: (wavesenterprise.ILeaseCancelTransaction|null);

        /** AtomicInnerTransaction sponsorFeeTransaction */
        sponsorFeeTransaction?: (wavesenterprise.ISponsorFeeTransaction|null);

        /** AtomicInnerTransaction setAssetScriptTransaction */
        setAssetScriptTransaction?: (wavesenterprise.ISetAssetScriptTransaction|null);

        /** AtomicInnerTransaction dataTransaction */
        dataTransaction?: (wavesenterprise.IDataTransaction|null);

        /** AtomicInnerTransaction transferTransaction */
        transferTransaction?: (wavesenterprise.ITransferTransaction|null);

        /** AtomicInnerTransaction massTransferTransaction */
        massTransferTransaction?: (wavesenterprise.IMassTransferTransaction|null);

        /** AtomicInnerTransaction permitTransaction */
        permitTransaction?: (wavesenterprise.IPermitTransaction|null);

        /** AtomicInnerTransaction createPolicyTransaction */
        createPolicyTransaction?: (wavesenterprise.ICreatePolicyTransaction|null);

        /** AtomicInnerTransaction updatePolicyTransaction */
        updatePolicyTransaction?: (wavesenterprise.IUpdatePolicyTransaction|null);

        /** AtomicInnerTransaction policyDataHashTransaction */
        policyDataHashTransaction?: (wavesenterprise.IPolicyDataHashTransaction|null);

        /** AtomicInnerTransaction createContractTransaction */
        createContractTransaction?: (wavesenterprise.ICreateContractTransaction|null);

        /** AtomicInnerTransaction callContractTransaction */
        callContractTransaction?: (wavesenterprise.ICallContractTransaction|null);

        /** AtomicInnerTransaction executedContractTransaction */
        executedContractTransaction?: (wavesenterprise.IExecutedContractTransaction|null);

        /** AtomicInnerTransaction disableContractTransaction */
        disableContractTransaction?: (wavesenterprise.IDisableContractTransaction|null);

        /** AtomicInnerTransaction updateContractTransaction */
        updateContractTransaction?: (wavesenterprise.IUpdateContractTransaction|null);

        /** AtomicInnerTransaction setScriptTransaction */
        setScriptTransaction?: (wavesenterprise.ISetScriptTransaction|null);
    }

    /** Represents an AtomicInnerTransaction. */
    class AtomicInnerTransaction implements IAtomicInnerTransaction {

        /**
         * Constructs a new AtomicInnerTransaction.
         * @param [properties] Properties to set
         */
        constructor(properties?: wavesenterprise.IAtomicInnerTransaction);

        /** AtomicInnerTransaction version. */
        public version: number;

        /** AtomicInnerTransaction genesisTransaction. */
        public genesisTransaction?: (wavesenterprise.IGenesisTransaction|null);

        /** AtomicInnerTransaction genesisPermitTransaction. */
        public genesisPermitTransaction?: (wavesenterprise.IGenesisPermitTransaction|null);

        /** AtomicInnerTransaction genesisRegisterNodeTransaction. */
        public genesisRegisterNodeTransaction?: (wavesenterprise.IGenesisRegisterNodeTransaction|null);

        /** AtomicInnerTransaction registerNodeTransaction. */
        public registerNodeTransaction?: (wavesenterprise.IRegisterNodeTransaction|null);

        /** AtomicInnerTransaction createAliasTransaction. */
        public createAliasTransaction?: (wavesenterprise.ICreateAliasTransaction|null);

        /** AtomicInnerTransaction issueTransaction. */
        public issueTransaction?: (wavesenterprise.IIssueTransaction|null);

        /** AtomicInnerTransaction reissueTransaction. */
        public reissueTransaction?: (wavesenterprise.IReissueTransaction|null);

        /** AtomicInnerTransaction burnTransaction. */
        public burnTransaction?: (wavesenterprise.IBurnTransaction|null);

        /** AtomicInnerTransaction leaseTransaction. */
        public leaseTransaction?: (wavesenterprise.ILeaseTransaction|null);

        /** AtomicInnerTransaction leaseCancelTransaction. */
        public leaseCancelTransaction?: (wavesenterprise.ILeaseCancelTransaction|null);

        /** AtomicInnerTransaction sponsorFeeTransaction. */
        public sponsorFeeTransaction?: (wavesenterprise.ISponsorFeeTransaction|null);

        /** AtomicInnerTransaction setAssetScriptTransaction. */
        public setAssetScriptTransaction?: (wavesenterprise.ISetAssetScriptTransaction|null);

        /** AtomicInnerTransaction dataTransaction. */
        public dataTransaction?: (wavesenterprise.IDataTransaction|null);

        /** AtomicInnerTransaction transferTransaction. */
        public transferTransaction?: (wavesenterprise.ITransferTransaction|null);

        /** AtomicInnerTransaction massTransferTransaction. */
        public massTransferTransaction?: (wavesenterprise.IMassTransferTransaction|null);

        /** AtomicInnerTransaction permitTransaction. */
        public permitTransaction?: (wavesenterprise.IPermitTransaction|null);

        /** AtomicInnerTransaction createPolicyTransaction. */
        public createPolicyTransaction?: (wavesenterprise.ICreatePolicyTransaction|null);

        /** AtomicInnerTransaction updatePolicyTransaction. */
        public updatePolicyTransaction?: (wavesenterprise.IUpdatePolicyTransaction|null);

        /** AtomicInnerTransaction policyDataHashTransaction. */
        public policyDataHashTransaction?: (wavesenterprise.IPolicyDataHashTransaction|null);

        /** AtomicInnerTransaction createContractTransaction. */
        public createContractTransaction?: (wavesenterprise.ICreateContractTransaction|null);

        /** AtomicInnerTransaction callContractTransaction. */
        public callContractTransaction?: (wavesenterprise.ICallContractTransaction|null);

        /** AtomicInnerTransaction executedContractTransaction. */
        public executedContractTransaction?: (wavesenterprise.IExecutedContractTransaction|null);

        /** AtomicInnerTransaction disableContractTransaction. */
        public disableContractTransaction?: (wavesenterprise.IDisableContractTransaction|null);

        /** AtomicInnerTransaction updateContractTransaction. */
        public updateContractTransaction?: (wavesenterprise.IUpdateContractTransaction|null);

        /** AtomicInnerTransaction setScriptTransaction. */
        public setScriptTransaction?: (wavesenterprise.ISetScriptTransaction|null);

        /** AtomicInnerTransaction transaction. */
        public transaction?: ("genesisTransaction"|"genesisPermitTransaction"|"genesisRegisterNodeTransaction"|"registerNodeTransaction"|"createAliasTransaction"|"issueTransaction"|"reissueTransaction"|"burnTransaction"|"leaseTransaction"|"leaseCancelTransaction"|"sponsorFeeTransaction"|"setAssetScriptTransaction"|"dataTransaction"|"transferTransaction"|"massTransferTransaction"|"permitTransaction"|"createPolicyTransaction"|"updatePolicyTransaction"|"policyDataHashTransaction"|"createContractTransaction"|"callContractTransaction"|"executedContractTransaction"|"disableContractTransaction"|"updateContractTransaction"|"setScriptTransaction");

        /**
         * Creates a new AtomicInnerTransaction instance using the specified properties.
         * @param [properties] Properties to set
         * @returns AtomicInnerTransaction instance
         */
        public static create(properties?: wavesenterprise.IAtomicInnerTransaction): wavesenterprise.AtomicInnerTransaction;

        /**
         * Encodes the specified AtomicInnerTransaction message. Does not implicitly {@link wavesenterprise.AtomicInnerTransaction.verify|verify} messages.
         * @param message AtomicInnerTransaction message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: wavesenterprise.IAtomicInnerTransaction, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified AtomicInnerTransaction message, length delimited. Does not implicitly {@link wavesenterprise.AtomicInnerTransaction.verify|verify} messages.
         * @param message AtomicInnerTransaction message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: wavesenterprise.IAtomicInnerTransaction, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes an AtomicInnerTransaction message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns AtomicInnerTransaction
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): wavesenterprise.AtomicInnerTransaction;

        /**
         * Decodes an AtomicInnerTransaction message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns AtomicInnerTransaction
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): wavesenterprise.AtomicInnerTransaction;

        /**
         * Verifies an AtomicInnerTransaction message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates an AtomicInnerTransaction message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns AtomicInnerTransaction
         */
        public static fromObject(object: { [k: string]: any }): wavesenterprise.AtomicInnerTransaction;

        /**
         * Creates a plain object from an AtomicInnerTransaction message. Also converts values to other types if specified.
         * @param message AtomicInnerTransaction
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: wavesenterprise.AtomicInnerTransaction, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this AtomicInnerTransaction to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a SubscribeOnRequest. */
    interface ISubscribeOnRequest {

        /** SubscribeOnRequest genesisBlock */
        genesisBlock?: (wavesenterprise.IGenesisBlock|null);

        /** SubscribeOnRequest blockSignature */
        blockSignature?: (wavesenterprise.IBlockSignature|null);

        /** SubscribeOnRequest currentEvent */
        currentEvent?: (wavesenterprise.ICurrentEvent|null);

        /** SubscribeOnRequest eventsFilters */
        eventsFilters?: (wavesenterprise.IEventsFilter[]|null);
    }

    /** Represents a SubscribeOnRequest. */
    class SubscribeOnRequest implements ISubscribeOnRequest {

        /**
         * Constructs a new SubscribeOnRequest.
         * @param [properties] Properties to set
         */
        constructor(properties?: wavesenterprise.ISubscribeOnRequest);

        /** SubscribeOnRequest genesisBlock. */
        public genesisBlock?: (wavesenterprise.IGenesisBlock|null);

        /** SubscribeOnRequest blockSignature. */
        public blockSignature?: (wavesenterprise.IBlockSignature|null);

        /** SubscribeOnRequest currentEvent. */
        public currentEvent?: (wavesenterprise.ICurrentEvent|null);

        /** SubscribeOnRequest eventsFilters. */
        public eventsFilters: wavesenterprise.IEventsFilter[];

        /** SubscribeOnRequest startFrom. */
        public startFrom?: ("genesisBlock"|"blockSignature"|"currentEvent");

        /**
         * Creates a new SubscribeOnRequest instance using the specified properties.
         * @param [properties] Properties to set
         * @returns SubscribeOnRequest instance
         */
        public static create(properties?: wavesenterprise.ISubscribeOnRequest): wavesenterprise.SubscribeOnRequest;

        /**
         * Encodes the specified SubscribeOnRequest message. Does not implicitly {@link wavesenterprise.SubscribeOnRequest.verify|verify} messages.
         * @param message SubscribeOnRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: wavesenterprise.ISubscribeOnRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified SubscribeOnRequest message, length delimited. Does not implicitly {@link wavesenterprise.SubscribeOnRequest.verify|verify} messages.
         * @param message SubscribeOnRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: wavesenterprise.ISubscribeOnRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a SubscribeOnRequest message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns SubscribeOnRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): wavesenterprise.SubscribeOnRequest;

        /**
         * Decodes a SubscribeOnRequest message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns SubscribeOnRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): wavesenterprise.SubscribeOnRequest;

        /**
         * Verifies a SubscribeOnRequest message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a SubscribeOnRequest message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns SubscribeOnRequest
         */
        public static fromObject(object: { [k: string]: any }): wavesenterprise.SubscribeOnRequest;

        /**
         * Creates a plain object from a SubscribeOnRequest message. Also converts values to other types if specified.
         * @param message SubscribeOnRequest
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: wavesenterprise.SubscribeOnRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this SubscribeOnRequest to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a GenesisBlock. */
    interface IGenesisBlock {
    }

    /** Represents a GenesisBlock. */
    class GenesisBlock implements IGenesisBlock {

        /**
         * Constructs a new GenesisBlock.
         * @param [properties] Properties to set
         */
        constructor(properties?: wavesenterprise.IGenesisBlock);

        /**
         * Creates a new GenesisBlock instance using the specified properties.
         * @param [properties] Properties to set
         * @returns GenesisBlock instance
         */
        public static create(properties?: wavesenterprise.IGenesisBlock): wavesenterprise.GenesisBlock;

        /**
         * Encodes the specified GenesisBlock message. Does not implicitly {@link wavesenterprise.GenesisBlock.verify|verify} messages.
         * @param message GenesisBlock message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: wavesenterprise.IGenesisBlock, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified GenesisBlock message, length delimited. Does not implicitly {@link wavesenterprise.GenesisBlock.verify|verify} messages.
         * @param message GenesisBlock message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: wavesenterprise.IGenesisBlock, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a GenesisBlock message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns GenesisBlock
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): wavesenterprise.GenesisBlock;

        /**
         * Decodes a GenesisBlock message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns GenesisBlock
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): wavesenterprise.GenesisBlock;

        /**
         * Verifies a GenesisBlock message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a GenesisBlock message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns GenesisBlock
         */
        public static fromObject(object: { [k: string]: any }): wavesenterprise.GenesisBlock;

        /**
         * Creates a plain object from a GenesisBlock message. Also converts values to other types if specified.
         * @param message GenesisBlock
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: wavesenterprise.GenesisBlock, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this GenesisBlock to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a BlockSignature. */
    interface IBlockSignature {

        /** BlockSignature lastBlockSignature */
        lastBlockSignature?: (google.protobuf.IBytesValue|null);
    }

    /** Represents a BlockSignature. */
    class BlockSignature implements IBlockSignature {

        /**
         * Constructs a new BlockSignature.
         * @param [properties] Properties to set
         */
        constructor(properties?: wavesenterprise.IBlockSignature);

        /** BlockSignature lastBlockSignature. */
        public lastBlockSignature?: (google.protobuf.IBytesValue|null);

        /**
         * Creates a new BlockSignature instance using the specified properties.
         * @param [properties] Properties to set
         * @returns BlockSignature instance
         */
        public static create(properties?: wavesenterprise.IBlockSignature): wavesenterprise.BlockSignature;

        /**
         * Encodes the specified BlockSignature message. Does not implicitly {@link wavesenterprise.BlockSignature.verify|verify} messages.
         * @param message BlockSignature message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: wavesenterprise.IBlockSignature, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified BlockSignature message, length delimited. Does not implicitly {@link wavesenterprise.BlockSignature.verify|verify} messages.
         * @param message BlockSignature message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: wavesenterprise.IBlockSignature, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a BlockSignature message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns BlockSignature
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): wavesenterprise.BlockSignature;

        /**
         * Decodes a BlockSignature message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns BlockSignature
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): wavesenterprise.BlockSignature;

        /**
         * Verifies a BlockSignature message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a BlockSignature message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns BlockSignature
         */
        public static fromObject(object: { [k: string]: any }): wavesenterprise.BlockSignature;

        /**
         * Creates a plain object from a BlockSignature message. Also converts values to other types if specified.
         * @param message BlockSignature
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: wavesenterprise.BlockSignature, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this BlockSignature to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a CurrentEvent. */
    interface ICurrentEvent {
    }

    /** Represents a CurrentEvent. */
    class CurrentEvent implements ICurrentEvent {

        /**
         * Constructs a new CurrentEvent.
         * @param [properties] Properties to set
         */
        constructor(properties?: wavesenterprise.ICurrentEvent);

        /**
         * Creates a new CurrentEvent instance using the specified properties.
         * @param [properties] Properties to set
         * @returns CurrentEvent instance
         */
        public static create(properties?: wavesenterprise.ICurrentEvent): wavesenterprise.CurrentEvent;

        /**
         * Encodes the specified CurrentEvent message. Does not implicitly {@link wavesenterprise.CurrentEvent.verify|verify} messages.
         * @param message CurrentEvent message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: wavesenterprise.ICurrentEvent, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified CurrentEvent message, length delimited. Does not implicitly {@link wavesenterprise.CurrentEvent.verify|verify} messages.
         * @param message CurrentEvent message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: wavesenterprise.ICurrentEvent, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a CurrentEvent message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns CurrentEvent
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): wavesenterprise.CurrentEvent;

        /**
         * Decodes a CurrentEvent message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns CurrentEvent
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): wavesenterprise.CurrentEvent;

        /**
         * Verifies a CurrentEvent message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a CurrentEvent message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns CurrentEvent
         */
        public static fromObject(object: { [k: string]: any }): wavesenterprise.CurrentEvent;

        /**
         * Creates a plain object from a CurrentEvent message. Also converts values to other types if specified.
         * @param message CurrentEvent
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: wavesenterprise.CurrentEvent, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this CurrentEvent to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of an EventsFilter. */
    interface IEventsFilter {

        /** EventsFilter filterIn */
        filterIn?: (wavesenterprise.EventsFilter.IFilterIn|null);

        /** EventsFilter filterOut */
        filterOut?: (wavesenterprise.EventsFilter.IFilterOut|null);

        /** EventsFilter txTypeFilter */
        txTypeFilter?: (wavesenterprise.ITxTypeFilter|null);

        /** EventsFilter contractIdFilter */
        contractIdFilter?: (wavesenterprise.IContractIdFilter|null);
    }

    /** Represents an EventsFilter. */
    class EventsFilter implements IEventsFilter {

        /**
         * Constructs a new EventsFilter.
         * @param [properties] Properties to set
         */
        constructor(properties?: wavesenterprise.IEventsFilter);

        /** EventsFilter filterIn. */
        public filterIn?: (wavesenterprise.EventsFilter.IFilterIn|null);

        /** EventsFilter filterOut. */
        public filterOut?: (wavesenterprise.EventsFilter.IFilterOut|null);

        /** EventsFilter txTypeFilter. */
        public txTypeFilter?: (wavesenterprise.ITxTypeFilter|null);

        /** EventsFilter contractIdFilter. */
        public contractIdFilter?: (wavesenterprise.IContractIdFilter|null);

        /** EventsFilter filterType. */
        public filterType?: ("filterIn"|"filterOut");

        /** EventsFilter eventsFilter. */
        public eventsFilter?: ("txTypeFilter"|"contractIdFilter");

        /**
         * Creates a new EventsFilter instance using the specified properties.
         * @param [properties] Properties to set
         * @returns EventsFilter instance
         */
        public static create(properties?: wavesenterprise.IEventsFilter): wavesenterprise.EventsFilter;

        /**
         * Encodes the specified EventsFilter message. Does not implicitly {@link wavesenterprise.EventsFilter.verify|verify} messages.
         * @param message EventsFilter message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: wavesenterprise.IEventsFilter, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified EventsFilter message, length delimited. Does not implicitly {@link wavesenterprise.EventsFilter.verify|verify} messages.
         * @param message EventsFilter message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: wavesenterprise.IEventsFilter, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes an EventsFilter message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns EventsFilter
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): wavesenterprise.EventsFilter;

        /**
         * Decodes an EventsFilter message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns EventsFilter
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): wavesenterprise.EventsFilter;

        /**
         * Verifies an EventsFilter message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates an EventsFilter message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns EventsFilter
         */
        public static fromObject(object: { [k: string]: any }): wavesenterprise.EventsFilter;

        /**
         * Creates a plain object from an EventsFilter message. Also converts values to other types if specified.
         * @param message EventsFilter
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: wavesenterprise.EventsFilter, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this EventsFilter to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    namespace EventsFilter {

        /** Properties of a FilterIn. */
        interface IFilterIn {
        }

        /** Represents a FilterIn. */
        class FilterIn implements IFilterIn {

            /**
             * Constructs a new FilterIn.
             * @param [properties] Properties to set
             */
            constructor(properties?: wavesenterprise.EventsFilter.IFilterIn);

            /**
             * Creates a new FilterIn instance using the specified properties.
             * @param [properties] Properties to set
             * @returns FilterIn instance
             */
            public static create(properties?: wavesenterprise.EventsFilter.IFilterIn): wavesenterprise.EventsFilter.FilterIn;

            /**
             * Encodes the specified FilterIn message. Does not implicitly {@link wavesenterprise.EventsFilter.FilterIn.verify|verify} messages.
             * @param message FilterIn message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: wavesenterprise.EventsFilter.IFilterIn, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified FilterIn message, length delimited. Does not implicitly {@link wavesenterprise.EventsFilter.FilterIn.verify|verify} messages.
             * @param message FilterIn message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: wavesenterprise.EventsFilter.IFilterIn, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a FilterIn message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns FilterIn
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): wavesenterprise.EventsFilter.FilterIn;

            /**
             * Decodes a FilterIn message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns FilterIn
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): wavesenterprise.EventsFilter.FilterIn;

            /**
             * Verifies a FilterIn message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a FilterIn message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns FilterIn
             */
            public static fromObject(object: { [k: string]: any }): wavesenterprise.EventsFilter.FilterIn;

            /**
             * Creates a plain object from a FilterIn message. Also converts values to other types if specified.
             * @param message FilterIn
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: wavesenterprise.EventsFilter.FilterIn, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this FilterIn to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };
        }

        /** Properties of a FilterOut. */
        interface IFilterOut {
        }

        /** Represents a FilterOut. */
        class FilterOut implements IFilterOut {

            /**
             * Constructs a new FilterOut.
             * @param [properties] Properties to set
             */
            constructor(properties?: wavesenterprise.EventsFilter.IFilterOut);

            /**
             * Creates a new FilterOut instance using the specified properties.
             * @param [properties] Properties to set
             * @returns FilterOut instance
             */
            public static create(properties?: wavesenterprise.EventsFilter.IFilterOut): wavesenterprise.EventsFilter.FilterOut;

            /**
             * Encodes the specified FilterOut message. Does not implicitly {@link wavesenterprise.EventsFilter.FilterOut.verify|verify} messages.
             * @param message FilterOut message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: wavesenterprise.EventsFilter.IFilterOut, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified FilterOut message, length delimited. Does not implicitly {@link wavesenterprise.EventsFilter.FilterOut.verify|verify} messages.
             * @param message FilterOut message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: wavesenterprise.EventsFilter.IFilterOut, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a FilterOut message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns FilterOut
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): wavesenterprise.EventsFilter.FilterOut;

            /**
             * Decodes a FilterOut message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns FilterOut
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): wavesenterprise.EventsFilter.FilterOut;

            /**
             * Verifies a FilterOut message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a FilterOut message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns FilterOut
             */
            public static fromObject(object: { [k: string]: any }): wavesenterprise.EventsFilter.FilterOut;

            /**
             * Creates a plain object from a FilterOut message. Also converts values to other types if specified.
             * @param message FilterOut
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: wavesenterprise.EventsFilter.FilterOut, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this FilterOut to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };
        }
    }

    /** Properties of a TxTypeFilter. */
    interface ITxTypeFilter {

        /** TxTypeFilter txTypes */
        txTypes?: (number[]|null);
    }

    /** Represents a TxTypeFilter. */
    class TxTypeFilter implements ITxTypeFilter {

        /**
         * Constructs a new TxTypeFilter.
         * @param [properties] Properties to set
         */
        constructor(properties?: wavesenterprise.ITxTypeFilter);

        /** TxTypeFilter txTypes. */
        public txTypes: number[];

        /**
         * Creates a new TxTypeFilter instance using the specified properties.
         * @param [properties] Properties to set
         * @returns TxTypeFilter instance
         */
        public static create(properties?: wavesenterprise.ITxTypeFilter): wavesenterprise.TxTypeFilter;

        /**
         * Encodes the specified TxTypeFilter message. Does not implicitly {@link wavesenterprise.TxTypeFilter.verify|verify} messages.
         * @param message TxTypeFilter message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: wavesenterprise.ITxTypeFilter, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified TxTypeFilter message, length delimited. Does not implicitly {@link wavesenterprise.TxTypeFilter.verify|verify} messages.
         * @param message TxTypeFilter message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: wavesenterprise.ITxTypeFilter, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a TxTypeFilter message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns TxTypeFilter
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): wavesenterprise.TxTypeFilter;

        /**
         * Decodes a TxTypeFilter message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns TxTypeFilter
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): wavesenterprise.TxTypeFilter;

        /**
         * Verifies a TxTypeFilter message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a TxTypeFilter message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns TxTypeFilter
         */
        public static fromObject(object: { [k: string]: any }): wavesenterprise.TxTypeFilter;

        /**
         * Creates a plain object from a TxTypeFilter message. Also converts values to other types if specified.
         * @param message TxTypeFilter
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: wavesenterprise.TxTypeFilter, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this TxTypeFilter to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a ContractIdFilter. */
    interface IContractIdFilter {

        /** ContractIdFilter contractIds */
        contractIds?: (Uint8Array[]|null);
    }

    /** Represents a ContractIdFilter. */
    class ContractIdFilter implements IContractIdFilter {

        /**
         * Constructs a new ContractIdFilter.
         * @param [properties] Properties to set
         */
        constructor(properties?: wavesenterprise.IContractIdFilter);

        /** ContractIdFilter contractIds. */
        public contractIds: Uint8Array[];

        /**
         * Creates a new ContractIdFilter instance using the specified properties.
         * @param [properties] Properties to set
         * @returns ContractIdFilter instance
         */
        public static create(properties?: wavesenterprise.IContractIdFilter): wavesenterprise.ContractIdFilter;

        /**
         * Encodes the specified ContractIdFilter message. Does not implicitly {@link wavesenterprise.ContractIdFilter.verify|verify} messages.
         * @param message ContractIdFilter message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: wavesenterprise.IContractIdFilter, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified ContractIdFilter message, length delimited. Does not implicitly {@link wavesenterprise.ContractIdFilter.verify|verify} messages.
         * @param message ContractIdFilter message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: wavesenterprise.IContractIdFilter, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a ContractIdFilter message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns ContractIdFilter
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): wavesenterprise.ContractIdFilter;

        /**
         * Decodes a ContractIdFilter message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns ContractIdFilter
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): wavesenterprise.ContractIdFilter;

        /**
         * Verifies a ContractIdFilter message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a ContractIdFilter message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns ContractIdFilter
         */
        public static fromObject(object: { [k: string]: any }): wavesenterprise.ContractIdFilter;

        /**
         * Creates a plain object from a ContractIdFilter message. Also converts values to other types if specified.
         * @param message ContractIdFilter
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: wavesenterprise.ContractIdFilter, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this ContractIdFilter to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Represents a ContractStatusService */
    class ContractStatusService extends $protobuf.rpc.Service {

        /**
         * Constructs a new ContractStatusService service.
         * @param rpcImpl RPC implementation
         * @param [requestDelimited=false] Whether requests are length-delimited
         * @param [responseDelimited=false] Whether responses are length-delimited
         */
        constructor(rpcImpl: $protobuf.RPCImpl, requestDelimited?: boolean, responseDelimited?: boolean);

        /**
         * Creates new ContractStatusService service using the specified rpc implementation.
         * @param rpcImpl RPC implementation
         * @param [requestDelimited=false] Whether requests are length-delimited
         * @param [responseDelimited=false] Whether responses are length-delimited
         * @returns RPC service. Useful where requests and/or responses are streamed.
         */
        public static create(rpcImpl: $protobuf.RPCImpl, requestDelimited?: boolean, responseDelimited?: boolean): ContractStatusService;

        /**
         * Calls ContractExecutionStatuses.
         * @param request ContractExecutionRequest message or plain object
         * @param callback Node-style callback called with the error, if any, and ContractExecutionResponse
         */
        public contractExecutionStatuses(request: wavesenterprise.IContractExecutionRequest, callback: wavesenterprise.ContractStatusService.ContractExecutionStatusesCallback): void;

        /**
         * Calls ContractExecutionStatuses.
         * @param request ContractExecutionRequest message or plain object
         * @returns Promise
         */
        public contractExecutionStatuses(request: wavesenterprise.IContractExecutionRequest): Promise<wavesenterprise.ContractExecutionResponse>;
    }

    namespace ContractStatusService {

        /**
         * Callback as used by {@link wavesenterprise.ContractStatusService#contractExecutionStatuses}.
         * @param error Error, if any
         * @param [response] ContractExecutionResponse
         */
        type ContractExecutionStatusesCallback = (error: (Error|null), response?: wavesenterprise.ContractExecutionResponse) => void;
    }

    /** Properties of a ContractExecutionRequest. */
    interface IContractExecutionRequest {

        /** ContractExecutionRequest txId */
        txId?: (Uint8Array|null);
    }

    /** Represents a ContractExecutionRequest. */
    class ContractExecutionRequest implements IContractExecutionRequest {

        /**
         * Constructs a new ContractExecutionRequest.
         * @param [properties] Properties to set
         */
        constructor(properties?: wavesenterprise.IContractExecutionRequest);

        /** ContractExecutionRequest txId. */
        public txId: Uint8Array;

        /**
         * Creates a new ContractExecutionRequest instance using the specified properties.
         * @param [properties] Properties to set
         * @returns ContractExecutionRequest instance
         */
        public static create(properties?: wavesenterprise.IContractExecutionRequest): wavesenterprise.ContractExecutionRequest;

        /**
         * Encodes the specified ContractExecutionRequest message. Does not implicitly {@link wavesenterprise.ContractExecutionRequest.verify|verify} messages.
         * @param message ContractExecutionRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: wavesenterprise.IContractExecutionRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified ContractExecutionRequest message, length delimited. Does not implicitly {@link wavesenterprise.ContractExecutionRequest.verify|verify} messages.
         * @param message ContractExecutionRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: wavesenterprise.IContractExecutionRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a ContractExecutionRequest message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns ContractExecutionRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): wavesenterprise.ContractExecutionRequest;

        /**
         * Decodes a ContractExecutionRequest message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns ContractExecutionRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): wavesenterprise.ContractExecutionRequest;

        /**
         * Verifies a ContractExecutionRequest message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a ContractExecutionRequest message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns ContractExecutionRequest
         */
        public static fromObject(object: { [k: string]: any }): wavesenterprise.ContractExecutionRequest;

        /**
         * Creates a plain object from a ContractExecutionRequest message. Also converts values to other types if specified.
         * @param message ContractExecutionRequest
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: wavesenterprise.ContractExecutionRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this ContractExecutionRequest to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a ContractExecutionResponse. */
    interface IContractExecutionResponse {

        /** ContractExecutionResponse sender */
        sender?: (Uint8Array|null);

        /** ContractExecutionResponse txId */
        txId?: (Uint8Array|null);

        /** ContractExecutionResponse status */
        status?: (wavesenterprise.ContractExecutionResponse.Status|null);

        /** ContractExecutionResponse code */
        code?: (google.protobuf.IInt32Value|null);

        /** ContractExecutionResponse message */
        message?: (string|null);

        /** ContractExecutionResponse timestamp */
        timestamp?: (number|Long|null);

        /** ContractExecutionResponse signature */
        signature?: (Uint8Array|null);
    }

    /** Represents a ContractExecutionResponse. */
    class ContractExecutionResponse implements IContractExecutionResponse {

        /**
         * Constructs a new ContractExecutionResponse.
         * @param [properties] Properties to set
         */
        constructor(properties?: wavesenterprise.IContractExecutionResponse);

        /** ContractExecutionResponse sender. */
        public sender: Uint8Array;

        /** ContractExecutionResponse txId. */
        public txId: Uint8Array;

        /** ContractExecutionResponse status. */
        public status: wavesenterprise.ContractExecutionResponse.Status;

        /** ContractExecutionResponse code. */
        public code?: (google.protobuf.IInt32Value|null);

        /** ContractExecutionResponse message. */
        public message: string;

        /** ContractExecutionResponse timestamp. */
        public timestamp: (number|Long);

        /** ContractExecutionResponse signature. */
        public signature: Uint8Array;

        /**
         * Creates a new ContractExecutionResponse instance using the specified properties.
         * @param [properties] Properties to set
         * @returns ContractExecutionResponse instance
         */
        public static create(properties?: wavesenterprise.IContractExecutionResponse): wavesenterprise.ContractExecutionResponse;

        /**
         * Encodes the specified ContractExecutionResponse message. Does not implicitly {@link wavesenterprise.ContractExecutionResponse.verify|verify} messages.
         * @param message ContractExecutionResponse message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: wavesenterprise.IContractExecutionResponse, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified ContractExecutionResponse message, length delimited. Does not implicitly {@link wavesenterprise.ContractExecutionResponse.verify|verify} messages.
         * @param message ContractExecutionResponse message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: wavesenterprise.IContractExecutionResponse, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a ContractExecutionResponse message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns ContractExecutionResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): wavesenterprise.ContractExecutionResponse;

        /**
         * Decodes a ContractExecutionResponse message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns ContractExecutionResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): wavesenterprise.ContractExecutionResponse;

        /**
         * Verifies a ContractExecutionResponse message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a ContractExecutionResponse message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns ContractExecutionResponse
         */
        public static fromObject(object: { [k: string]: any }): wavesenterprise.ContractExecutionResponse;

        /**
         * Creates a plain object from a ContractExecutionResponse message. Also converts values to other types if specified.
         * @param message ContractExecutionResponse
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: wavesenterprise.ContractExecutionResponse, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this ContractExecutionResponse to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    namespace ContractExecutionResponse {

        /** Status enum. */
        enum Status {
            SUCCESS = 0,
            ERROR = 1,
            FAILURE = 2
        }
    }

    /** Represents a NodeInfoService */
    class NodeInfoService extends $protobuf.rpc.Service {

        /**
         * Constructs a new NodeInfoService service.
         * @param rpcImpl RPC implementation
         * @param [requestDelimited=false] Whether requests are length-delimited
         * @param [responseDelimited=false] Whether responses are length-delimited
         */
        constructor(rpcImpl: $protobuf.RPCImpl, requestDelimited?: boolean, responseDelimited?: boolean);

        /**
         * Creates new NodeInfoService service using the specified rpc implementation.
         * @param rpcImpl RPC implementation
         * @param [requestDelimited=false] Whether requests are length-delimited
         * @param [responseDelimited=false] Whether responses are length-delimited
         * @returns RPC service. Useful where requests and/or responses are streamed.
         */
        public static create(rpcImpl: $protobuf.RPCImpl, requestDelimited?: boolean, responseDelimited?: boolean): NodeInfoService;

        /**
         * Calls NodeConfig.
         * @param request Empty message or plain object
         * @param callback Node-style callback called with the error, if any, and NodeConfigResponse
         */
        public nodeConfig(request: google.protobuf.IEmpty, callback: wavesenterprise.NodeInfoService.NodeConfigCallback): void;

        /**
         * Calls NodeConfig.
         * @param request Empty message or plain object
         * @returns Promise
         */
        public nodeConfig(request: google.protobuf.IEmpty): Promise<wavesenterprise.NodeConfigResponse>;
    }

    namespace NodeInfoService {

        /**
         * Callback as used by {@link wavesenterprise.NodeInfoService#nodeConfig}.
         * @param error Error, if any
         * @param [response] NodeConfigResponse
         */
        type NodeConfigCallback = (error: (Error|null), response?: wavesenterprise.NodeConfigResponse) => void;
    }

    /** Properties of a NodeConfigResponse. */
    interface INodeConfigResponse {

        /** NodeConfigResponse version */
        version?: (string|null);

        /** NodeConfigResponse cryptoType */
        cryptoType?: (wavesenterprise.CryptoType|null);

        /** NodeConfigResponse chainId */
        chainId?: (number|null);

        /** NodeConfigResponse consensus */
        consensus?: (wavesenterprise.ConsensusType|null);

        /** NodeConfigResponse minimumFee */
        minimumFee?: ({ [k: string]: (number|Long) }|null);

        /** NodeConfigResponse additionalFee */
        additionalFee?: ({ [k: string]: (number|Long) }|null);

        /** NodeConfigResponse maxTransactionsInMicroBlock */
        maxTransactionsInMicroBlock?: (number|null);

        /** NodeConfigResponse minMicroBlockAge */
        minMicroBlockAge?: (google.protobuf.IDuration|null);

        /** NodeConfigResponse microBlockInterval */
        microBlockInterval?: (google.protobuf.IDuration|null);

        /** NodeConfigResponse poaRoundInfo */
        poaRoundInfo?: (wavesenterprise.IPoaRoundInfo|null);

        /** NodeConfigResponse posRoundInfo */
        posRoundInfo?: (wavesenterprise.IPosRoundInfo|null);
    }

    /** Represents a NodeConfigResponse. */
    class NodeConfigResponse implements INodeConfigResponse {

        /**
         * Constructs a new NodeConfigResponse.
         * @param [properties] Properties to set
         */
        constructor(properties?: wavesenterprise.INodeConfigResponse);

        /** NodeConfigResponse version. */
        public version: string;

        /** NodeConfigResponse cryptoType. */
        public cryptoType: wavesenterprise.CryptoType;

        /** NodeConfigResponse chainId. */
        public chainId: number;

        /** NodeConfigResponse consensus. */
        public consensus: wavesenterprise.ConsensusType;

        /** NodeConfigResponse minimumFee. */
        public minimumFee: { [k: string]: (number|Long) };

        /** NodeConfigResponse additionalFee. */
        public additionalFee: { [k: string]: (number|Long) };

        /** NodeConfigResponse maxTransactionsInMicroBlock. */
        public maxTransactionsInMicroBlock: number;

        /** NodeConfigResponse minMicroBlockAge. */
        public minMicroBlockAge?: (google.protobuf.IDuration|null);

        /** NodeConfigResponse microBlockInterval. */
        public microBlockInterval?: (google.protobuf.IDuration|null);

        /** NodeConfigResponse poaRoundInfo. */
        public poaRoundInfo?: (wavesenterprise.IPoaRoundInfo|null);

        /** NodeConfigResponse posRoundInfo. */
        public posRoundInfo?: (wavesenterprise.IPosRoundInfo|null);

        /** NodeConfigResponse blockTiming. */
        public blockTiming?: ("poaRoundInfo"|"posRoundInfo");

        /**
         * Creates a new NodeConfigResponse instance using the specified properties.
         * @param [properties] Properties to set
         * @returns NodeConfigResponse instance
         */
        public static create(properties?: wavesenterprise.INodeConfigResponse): wavesenterprise.NodeConfigResponse;

        /**
         * Encodes the specified NodeConfigResponse message. Does not implicitly {@link wavesenterprise.NodeConfigResponse.verify|verify} messages.
         * @param message NodeConfigResponse message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: wavesenterprise.INodeConfigResponse, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified NodeConfigResponse message, length delimited. Does not implicitly {@link wavesenterprise.NodeConfigResponse.verify|verify} messages.
         * @param message NodeConfigResponse message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: wavesenterprise.INodeConfigResponse, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a NodeConfigResponse message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns NodeConfigResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): wavesenterprise.NodeConfigResponse;

        /**
         * Decodes a NodeConfigResponse message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns NodeConfigResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): wavesenterprise.NodeConfigResponse;

        /**
         * Verifies a NodeConfigResponse message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a NodeConfigResponse message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns NodeConfigResponse
         */
        public static fromObject(object: { [k: string]: any }): wavesenterprise.NodeConfigResponse;

        /**
         * Creates a plain object from a NodeConfigResponse message. Also converts values to other types if specified.
         * @param message NodeConfigResponse
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: wavesenterprise.NodeConfigResponse, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this NodeConfigResponse to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a PoaRoundInfo. */
    interface IPoaRoundInfo {

        /** PoaRoundInfo roundDuration */
        roundDuration?: (google.protobuf.IDuration|null);

        /** PoaRoundInfo syncDuration */
        syncDuration?: (google.protobuf.IDuration|null);
    }

    /** Represents a PoaRoundInfo. */
    class PoaRoundInfo implements IPoaRoundInfo {

        /**
         * Constructs a new PoaRoundInfo.
         * @param [properties] Properties to set
         */
        constructor(properties?: wavesenterprise.IPoaRoundInfo);

        /** PoaRoundInfo roundDuration. */
        public roundDuration?: (google.protobuf.IDuration|null);

        /** PoaRoundInfo syncDuration. */
        public syncDuration?: (google.protobuf.IDuration|null);

        /**
         * Creates a new PoaRoundInfo instance using the specified properties.
         * @param [properties] Properties to set
         * @returns PoaRoundInfo instance
         */
        public static create(properties?: wavesenterprise.IPoaRoundInfo): wavesenterprise.PoaRoundInfo;

        /**
         * Encodes the specified PoaRoundInfo message. Does not implicitly {@link wavesenterprise.PoaRoundInfo.verify|verify} messages.
         * @param message PoaRoundInfo message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: wavesenterprise.IPoaRoundInfo, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified PoaRoundInfo message, length delimited. Does not implicitly {@link wavesenterprise.PoaRoundInfo.verify|verify} messages.
         * @param message PoaRoundInfo message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: wavesenterprise.IPoaRoundInfo, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a PoaRoundInfo message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns PoaRoundInfo
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): wavesenterprise.PoaRoundInfo;

        /**
         * Decodes a PoaRoundInfo message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns PoaRoundInfo
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): wavesenterprise.PoaRoundInfo;

        /**
         * Verifies a PoaRoundInfo message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a PoaRoundInfo message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns PoaRoundInfo
         */
        public static fromObject(object: { [k: string]: any }): wavesenterprise.PoaRoundInfo;

        /**
         * Creates a plain object from a PoaRoundInfo message. Also converts values to other types if specified.
         * @param message PoaRoundInfo
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: wavesenterprise.PoaRoundInfo, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this PoaRoundInfo to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a PosRoundInfo. */
    interface IPosRoundInfo {

        /** PosRoundInfo averageBlockDelay */
        averageBlockDelay?: (google.protobuf.IDuration|null);
    }

    /** Represents a PosRoundInfo. */
    class PosRoundInfo implements IPosRoundInfo {

        /**
         * Constructs a new PosRoundInfo.
         * @param [properties] Properties to set
         */
        constructor(properties?: wavesenterprise.IPosRoundInfo);

        /** PosRoundInfo averageBlockDelay. */
        public averageBlockDelay?: (google.protobuf.IDuration|null);

        /**
         * Creates a new PosRoundInfo instance using the specified properties.
         * @param [properties] Properties to set
         * @returns PosRoundInfo instance
         */
        public static create(properties?: wavesenterprise.IPosRoundInfo): wavesenterprise.PosRoundInfo;

        /**
         * Encodes the specified PosRoundInfo message. Does not implicitly {@link wavesenterprise.PosRoundInfo.verify|verify} messages.
         * @param message PosRoundInfo message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: wavesenterprise.IPosRoundInfo, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified PosRoundInfo message, length delimited. Does not implicitly {@link wavesenterprise.PosRoundInfo.verify|verify} messages.
         * @param message PosRoundInfo message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: wavesenterprise.IPosRoundInfo, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a PosRoundInfo message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns PosRoundInfo
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): wavesenterprise.PosRoundInfo;

        /**
         * Decodes a PosRoundInfo message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns PosRoundInfo
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): wavesenterprise.PosRoundInfo;

        /**
         * Verifies a PosRoundInfo message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a PosRoundInfo message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns PosRoundInfo
         */
        public static fromObject(object: { [k: string]: any }): wavesenterprise.PosRoundInfo;

        /**
         * Creates a plain object from a PosRoundInfo message. Also converts values to other types if specified.
         * @param message PosRoundInfo
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: wavesenterprise.PosRoundInfo, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this PosRoundInfo to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** CryptoAlgo enum. */
    enum CryptoAlgo {
        UNKNOWN_CRYPTO_ALGO = 0,
        GOST_28147 = 1,
        GOST_3412_2015_K = 2,
        AES = 3
    }

    /** CryptoType enum. */
    enum CryptoType {
        UNKNOWN_CRYPTO_TYPE = 0,
        GOST = 1,
        CURVE_25519 = 2
    }

    /** ConsensusType enum. */
    enum ConsensusType {
        UNKNOWN_CONSENSUS_TYPE = 0,
        POA = 1,
        POS = 2,
        CFT = 3
    }

    /** Namespace grpc. */
    namespace grpc {

        /** Represents a TransactionPublicService */
        class TransactionPublicService extends $protobuf.rpc.Service {

            /**
             * Constructs a new TransactionPublicService service.
             * @param rpcImpl RPC implementation
             * @param [requestDelimited=false] Whether requests are length-delimited
             * @param [responseDelimited=false] Whether responses are length-delimited
             */
            constructor(rpcImpl: $protobuf.RPCImpl, requestDelimited?: boolean, responseDelimited?: boolean);

            /**
             * Creates new TransactionPublicService service using the specified rpc implementation.
             * @param rpcImpl RPC implementation
             * @param [requestDelimited=false] Whether requests are length-delimited
             * @param [responseDelimited=false] Whether responses are length-delimited
             * @returns RPC service. Useful where requests and/or responses are streamed.
             */
            public static create(rpcImpl: $protobuf.RPCImpl, requestDelimited?: boolean, responseDelimited?: boolean): TransactionPublicService;

            /**
             * Calls Broadcast.
             * @param request Transaction message or plain object
             * @param callback Node-style callback called with the error, if any, and Transaction
             */
            public broadcast(request: wavesenterprise.ITransaction, callback: wavesenterprise.grpc.TransactionPublicService.BroadcastCallback): void;

            /**
             * Calls Broadcast.
             * @param request Transaction message or plain object
             * @returns Promise
             */
            public broadcast(request: wavesenterprise.ITransaction): Promise<wavesenterprise.Transaction>;

            /**
             * Calls UtxInfo.
             * @param request Empty message or plain object
             * @param callback Node-style callback called with the error, if any, and UtxSize
             */
            public utxInfo(request: google.protobuf.IEmpty, callback: wavesenterprise.grpc.TransactionPublicService.UtxInfoCallback): void;

            /**
             * Calls UtxInfo.
             * @param request Empty message or plain object
             * @returns Promise
             */
            public utxInfo(request: google.protobuf.IEmpty): Promise<wavesenterprise.grpc.UtxSize>;

            /**
             * Calls TransactionInfo.
             * @param request TransactionInfoRequest message or plain object
             * @param callback Node-style callback called with the error, if any, and TransactionInfoResponse
             */
            public transactionInfo(request: wavesenterprise.ITransactionInfoRequest, callback: wavesenterprise.grpc.TransactionPublicService.TransactionInfoCallback): void;

            /**
             * Calls TransactionInfo.
             * @param request TransactionInfoRequest message or plain object
             * @returns Promise
             */
            public transactionInfo(request: wavesenterprise.ITransactionInfoRequest): Promise<wavesenterprise.TransactionInfoResponse>;
        }

        namespace TransactionPublicService {

            /**
             * Callback as used by {@link wavesenterprise.grpc.TransactionPublicService#broadcast}.
             * @param error Error, if any
             * @param [response] Transaction
             */
            type BroadcastCallback = (error: (Error|null), response?: wavesenterprise.Transaction) => void;

            /**
             * Callback as used by {@link wavesenterprise.grpc.TransactionPublicService#utxInfo}.
             * @param error Error, if any
             * @param [response] UtxSize
             */
            type UtxInfoCallback = (error: (Error|null), response?: wavesenterprise.grpc.UtxSize) => void;

            /**
             * Callback as used by {@link wavesenterprise.grpc.TransactionPublicService#transactionInfo}.
             * @param error Error, if any
             * @param [response] TransactionInfoResponse
             */
            type TransactionInfoCallback = (error: (Error|null), response?: wavesenterprise.TransactionInfoResponse) => void;
        }

        /** Properties of an UtxSize. */
        interface IUtxSize {

            /** UtxSize size */
            size?: (number|null);

            /** UtxSize sizeInBytes */
            sizeInBytes?: (number|Long|null);
        }

        /** Represents an UtxSize. */
        class UtxSize implements IUtxSize {

            /**
             * Constructs a new UtxSize.
             * @param [properties] Properties to set
             */
            constructor(properties?: wavesenterprise.grpc.IUtxSize);

            /** UtxSize size. */
            public size: number;

            /** UtxSize sizeInBytes. */
            public sizeInBytes: (number|Long);

            /**
             * Creates a new UtxSize instance using the specified properties.
             * @param [properties] Properties to set
             * @returns UtxSize instance
             */
            public static create(properties?: wavesenterprise.grpc.IUtxSize): wavesenterprise.grpc.UtxSize;

            /**
             * Encodes the specified UtxSize message. Does not implicitly {@link wavesenterprise.grpc.UtxSize.verify|verify} messages.
             * @param message UtxSize message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: wavesenterprise.grpc.IUtxSize, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified UtxSize message, length delimited. Does not implicitly {@link wavesenterprise.grpc.UtxSize.verify|verify} messages.
             * @param message UtxSize message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: wavesenterprise.grpc.IUtxSize, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes an UtxSize message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns UtxSize
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): wavesenterprise.grpc.UtxSize;

            /**
             * Decodes an UtxSize message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns UtxSize
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): wavesenterprise.grpc.UtxSize;

            /**
             * Verifies an UtxSize message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates an UtxSize message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns UtxSize
             */
            public static fromObject(object: { [k: string]: any }): wavesenterprise.grpc.UtxSize;

            /**
             * Creates a plain object from an UtxSize message. Also converts values to other types if specified.
             * @param message UtxSize
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: wavesenterprise.grpc.UtxSize, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this UtxSize to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };
        }
    }

    /** Properties of a TransactionInfoRequest. */
    interface ITransactionInfoRequest {

        /** TransactionInfoRequest txId */
        txId?: (string|null);
    }

    /** Represents a TransactionInfoRequest. */
    class TransactionInfoRequest implements ITransactionInfoRequest {

        /**
         * Constructs a new TransactionInfoRequest.
         * @param [properties] Properties to set
         */
        constructor(properties?: wavesenterprise.ITransactionInfoRequest);

        /** TransactionInfoRequest txId. */
        public txId: string;

        /**
         * Creates a new TransactionInfoRequest instance using the specified properties.
         * @param [properties] Properties to set
         * @returns TransactionInfoRequest instance
         */
        public static create(properties?: wavesenterprise.ITransactionInfoRequest): wavesenterprise.TransactionInfoRequest;

        /**
         * Encodes the specified TransactionInfoRequest message. Does not implicitly {@link wavesenterprise.TransactionInfoRequest.verify|verify} messages.
         * @param message TransactionInfoRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: wavesenterprise.ITransactionInfoRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified TransactionInfoRequest message, length delimited. Does not implicitly {@link wavesenterprise.TransactionInfoRequest.verify|verify} messages.
         * @param message TransactionInfoRequest message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: wavesenterprise.ITransactionInfoRequest, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a TransactionInfoRequest message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns TransactionInfoRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): wavesenterprise.TransactionInfoRequest;

        /**
         * Decodes a TransactionInfoRequest message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns TransactionInfoRequest
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): wavesenterprise.TransactionInfoRequest;

        /**
         * Verifies a TransactionInfoRequest message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a TransactionInfoRequest message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns TransactionInfoRequest
         */
        public static fromObject(object: { [k: string]: any }): wavesenterprise.TransactionInfoRequest;

        /**
         * Creates a plain object from a TransactionInfoRequest message. Also converts values to other types if specified.
         * @param message TransactionInfoRequest
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: wavesenterprise.TransactionInfoRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this TransactionInfoRequest to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }

    /** Properties of a TransactionInfoResponse. */
    interface ITransactionInfoResponse {

        /** TransactionInfoResponse height */
        height?: (number|null);

        /** TransactionInfoResponse transaction */
        transaction?: (wavesenterprise.ITransaction|null);
    }

    /** Represents a TransactionInfoResponse. */
    class TransactionInfoResponse implements ITransactionInfoResponse {

        /**
         * Constructs a new TransactionInfoResponse.
         * @param [properties] Properties to set
         */
        constructor(properties?: wavesenterprise.ITransactionInfoResponse);

        /** TransactionInfoResponse height. */
        public height: number;

        /** TransactionInfoResponse transaction. */
        public transaction?: (wavesenterprise.ITransaction|null);

        /**
         * Creates a new TransactionInfoResponse instance using the specified properties.
         * @param [properties] Properties to set
         * @returns TransactionInfoResponse instance
         */
        public static create(properties?: wavesenterprise.ITransactionInfoResponse): wavesenterprise.TransactionInfoResponse;

        /**
         * Encodes the specified TransactionInfoResponse message. Does not implicitly {@link wavesenterprise.TransactionInfoResponse.verify|verify} messages.
         * @param message TransactionInfoResponse message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encode(message: wavesenterprise.ITransactionInfoResponse, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Encodes the specified TransactionInfoResponse message, length delimited. Does not implicitly {@link wavesenterprise.TransactionInfoResponse.verify|verify} messages.
         * @param message TransactionInfoResponse message or plain object to encode
         * @param [writer] Writer to encode to
         * @returns Writer
         */
        public static encodeDelimited(message: wavesenterprise.ITransactionInfoResponse, writer?: $protobuf.Writer): $protobuf.Writer;

        /**
         * Decodes a TransactionInfoResponse message from the specified reader or buffer.
         * @param reader Reader or buffer to decode from
         * @param [length] Message length if known beforehand
         * @returns TransactionInfoResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): wavesenterprise.TransactionInfoResponse;

        /**
         * Decodes a TransactionInfoResponse message from the specified reader or buffer, length delimited.
         * @param reader Reader or buffer to decode from
         * @returns TransactionInfoResponse
         * @throws {Error} If the payload is not a reader or valid buffer
         * @throws {$protobuf.util.ProtocolError} If required fields are missing
         */
        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): wavesenterprise.TransactionInfoResponse;

        /**
         * Verifies a TransactionInfoResponse message.
         * @param message Plain object to verify
         * @returns `null` if valid, otherwise the reason why it is not
         */
        public static verify(message: { [k: string]: any }): (string|null);

        /**
         * Creates a TransactionInfoResponse message from a plain object. Also converts values to their respective internal types.
         * @param object Plain object
         * @returns TransactionInfoResponse
         */
        public static fromObject(object: { [k: string]: any }): wavesenterprise.TransactionInfoResponse;

        /**
         * Creates a plain object from a TransactionInfoResponse message. Also converts values to other types if specified.
         * @param message TransactionInfoResponse
         * @param [options] Conversion options
         * @returns Plain object
         */
        public static toObject(message: wavesenterprise.TransactionInfoResponse, options?: $protobuf.IConversionOptions): { [k: string]: any };

        /**
         * Converts this TransactionInfoResponse to JSON.
         * @returns JSON object
         */
        public toJSON(): { [k: string]: any };
    }
}

/** Namespace google. */
export namespace google {

    /** Namespace protobuf. */
    namespace protobuf {

        /** Properties of a DoubleValue. */
        interface IDoubleValue {

            /** DoubleValue value */
            value?: (number|null);
        }

        /** Represents a DoubleValue. */
        class DoubleValue implements IDoubleValue {

            /**
             * Constructs a new DoubleValue.
             * @param [properties] Properties to set
             */
            constructor(properties?: google.protobuf.IDoubleValue);

            /** DoubleValue value. */
            public value: number;

            /**
             * Creates a new DoubleValue instance using the specified properties.
             * @param [properties] Properties to set
             * @returns DoubleValue instance
             */
            public static create(properties?: google.protobuf.IDoubleValue): google.protobuf.DoubleValue;

            /**
             * Encodes the specified DoubleValue message. Does not implicitly {@link google.protobuf.DoubleValue.verify|verify} messages.
             * @param message DoubleValue message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: google.protobuf.IDoubleValue, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified DoubleValue message, length delimited. Does not implicitly {@link google.protobuf.DoubleValue.verify|verify} messages.
             * @param message DoubleValue message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: google.protobuf.IDoubleValue, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a DoubleValue message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns DoubleValue
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.protobuf.DoubleValue;

            /**
             * Decodes a DoubleValue message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns DoubleValue
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.protobuf.DoubleValue;

            /**
             * Verifies a DoubleValue message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a DoubleValue message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns DoubleValue
             */
            public static fromObject(object: { [k: string]: any }): google.protobuf.DoubleValue;

            /**
             * Creates a plain object from a DoubleValue message. Also converts values to other types if specified.
             * @param message DoubleValue
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: google.protobuf.DoubleValue, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this DoubleValue to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };
        }

        /** Properties of a FloatValue. */
        interface IFloatValue {

            /** FloatValue value */
            value?: (number|null);
        }

        /** Represents a FloatValue. */
        class FloatValue implements IFloatValue {

            /**
             * Constructs a new FloatValue.
             * @param [properties] Properties to set
             */
            constructor(properties?: google.protobuf.IFloatValue);

            /** FloatValue value. */
            public value: number;

            /**
             * Creates a new FloatValue instance using the specified properties.
             * @param [properties] Properties to set
             * @returns FloatValue instance
             */
            public static create(properties?: google.protobuf.IFloatValue): google.protobuf.FloatValue;

            /**
             * Encodes the specified FloatValue message. Does not implicitly {@link google.protobuf.FloatValue.verify|verify} messages.
             * @param message FloatValue message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: google.protobuf.IFloatValue, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified FloatValue message, length delimited. Does not implicitly {@link google.protobuf.FloatValue.verify|verify} messages.
             * @param message FloatValue message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: google.protobuf.IFloatValue, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a FloatValue message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns FloatValue
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.protobuf.FloatValue;

            /**
             * Decodes a FloatValue message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns FloatValue
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.protobuf.FloatValue;

            /**
             * Verifies a FloatValue message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a FloatValue message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns FloatValue
             */
            public static fromObject(object: { [k: string]: any }): google.protobuf.FloatValue;

            /**
             * Creates a plain object from a FloatValue message. Also converts values to other types if specified.
             * @param message FloatValue
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: google.protobuf.FloatValue, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this FloatValue to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };
        }

        /** Properties of an Int64Value. */
        interface IInt64Value {

            /** Int64Value value */
            value?: (number|Long|null);
        }

        /** Represents an Int64Value. */
        class Int64Value implements IInt64Value {

            /**
             * Constructs a new Int64Value.
             * @param [properties] Properties to set
             */
            constructor(properties?: google.protobuf.IInt64Value);

            /** Int64Value value. */
            public value: (number|Long);

            /**
             * Creates a new Int64Value instance using the specified properties.
             * @param [properties] Properties to set
             * @returns Int64Value instance
             */
            public static create(properties?: google.protobuf.IInt64Value): google.protobuf.Int64Value;

            /**
             * Encodes the specified Int64Value message. Does not implicitly {@link google.protobuf.Int64Value.verify|verify} messages.
             * @param message Int64Value message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: google.protobuf.IInt64Value, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified Int64Value message, length delimited. Does not implicitly {@link google.protobuf.Int64Value.verify|verify} messages.
             * @param message Int64Value message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: google.protobuf.IInt64Value, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes an Int64Value message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns Int64Value
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.protobuf.Int64Value;

            /**
             * Decodes an Int64Value message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns Int64Value
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.protobuf.Int64Value;

            /**
             * Verifies an Int64Value message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates an Int64Value message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns Int64Value
             */
            public static fromObject(object: { [k: string]: any }): google.protobuf.Int64Value;

            /**
             * Creates a plain object from an Int64Value message. Also converts values to other types if specified.
             * @param message Int64Value
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: google.protobuf.Int64Value, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this Int64Value to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };
        }

        /** Properties of a UInt64Value. */
        interface IUInt64Value {

            /** UInt64Value value */
            value?: (number|Long|null);
        }

        /** Represents a UInt64Value. */
        class UInt64Value implements IUInt64Value {

            /**
             * Constructs a new UInt64Value.
             * @param [properties] Properties to set
             */
            constructor(properties?: google.protobuf.IUInt64Value);

            /** UInt64Value value. */
            public value: (number|Long);

            /**
             * Creates a new UInt64Value instance using the specified properties.
             * @param [properties] Properties to set
             * @returns UInt64Value instance
             */
            public static create(properties?: google.protobuf.IUInt64Value): google.protobuf.UInt64Value;

            /**
             * Encodes the specified UInt64Value message. Does not implicitly {@link google.protobuf.UInt64Value.verify|verify} messages.
             * @param message UInt64Value message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: google.protobuf.IUInt64Value, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified UInt64Value message, length delimited. Does not implicitly {@link google.protobuf.UInt64Value.verify|verify} messages.
             * @param message UInt64Value message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: google.protobuf.IUInt64Value, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a UInt64Value message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns UInt64Value
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.protobuf.UInt64Value;

            /**
             * Decodes a UInt64Value message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns UInt64Value
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.protobuf.UInt64Value;

            /**
             * Verifies a UInt64Value message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a UInt64Value message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns UInt64Value
             */
            public static fromObject(object: { [k: string]: any }): google.protobuf.UInt64Value;

            /**
             * Creates a plain object from a UInt64Value message. Also converts values to other types if specified.
             * @param message UInt64Value
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: google.protobuf.UInt64Value, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this UInt64Value to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };
        }

        /** Properties of an Int32Value. */
        interface IInt32Value {

            /** Int32Value value */
            value?: (number|null);
        }

        /** Represents an Int32Value. */
        class Int32Value implements IInt32Value {

            /**
             * Constructs a new Int32Value.
             * @param [properties] Properties to set
             */
            constructor(properties?: google.protobuf.IInt32Value);

            /** Int32Value value. */
            public value: number;

            /**
             * Creates a new Int32Value instance using the specified properties.
             * @param [properties] Properties to set
             * @returns Int32Value instance
             */
            public static create(properties?: google.protobuf.IInt32Value): google.protobuf.Int32Value;

            /**
             * Encodes the specified Int32Value message. Does not implicitly {@link google.protobuf.Int32Value.verify|verify} messages.
             * @param message Int32Value message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: google.protobuf.IInt32Value, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified Int32Value message, length delimited. Does not implicitly {@link google.protobuf.Int32Value.verify|verify} messages.
             * @param message Int32Value message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: google.protobuf.IInt32Value, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes an Int32Value message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns Int32Value
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.protobuf.Int32Value;

            /**
             * Decodes an Int32Value message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns Int32Value
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.protobuf.Int32Value;

            /**
             * Verifies an Int32Value message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates an Int32Value message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns Int32Value
             */
            public static fromObject(object: { [k: string]: any }): google.protobuf.Int32Value;

            /**
             * Creates a plain object from an Int32Value message. Also converts values to other types if specified.
             * @param message Int32Value
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: google.protobuf.Int32Value, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this Int32Value to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };
        }

        /** Properties of a UInt32Value. */
        interface IUInt32Value {

            /** UInt32Value value */
            value?: (number|null);
        }

        /** Represents a UInt32Value. */
        class UInt32Value implements IUInt32Value {

            /**
             * Constructs a new UInt32Value.
             * @param [properties] Properties to set
             */
            constructor(properties?: google.protobuf.IUInt32Value);

            /** UInt32Value value. */
            public value: number;

            /**
             * Creates a new UInt32Value instance using the specified properties.
             * @param [properties] Properties to set
             * @returns UInt32Value instance
             */
            public static create(properties?: google.protobuf.IUInt32Value): google.protobuf.UInt32Value;

            /**
             * Encodes the specified UInt32Value message. Does not implicitly {@link google.protobuf.UInt32Value.verify|verify} messages.
             * @param message UInt32Value message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: google.protobuf.IUInt32Value, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified UInt32Value message, length delimited. Does not implicitly {@link google.protobuf.UInt32Value.verify|verify} messages.
             * @param message UInt32Value message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: google.protobuf.IUInt32Value, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a UInt32Value message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns UInt32Value
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.protobuf.UInt32Value;

            /**
             * Decodes a UInt32Value message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns UInt32Value
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.protobuf.UInt32Value;

            /**
             * Verifies a UInt32Value message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a UInt32Value message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns UInt32Value
             */
            public static fromObject(object: { [k: string]: any }): google.protobuf.UInt32Value;

            /**
             * Creates a plain object from a UInt32Value message. Also converts values to other types if specified.
             * @param message UInt32Value
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: google.protobuf.UInt32Value, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this UInt32Value to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };
        }

        /** Properties of a BoolValue. */
        interface IBoolValue {

            /** BoolValue value */
            value?: (boolean|null);
        }

        /** Represents a BoolValue. */
        class BoolValue implements IBoolValue {

            /**
             * Constructs a new BoolValue.
             * @param [properties] Properties to set
             */
            constructor(properties?: google.protobuf.IBoolValue);

            /** BoolValue value. */
            public value: boolean;

            /**
             * Creates a new BoolValue instance using the specified properties.
             * @param [properties] Properties to set
             * @returns BoolValue instance
             */
            public static create(properties?: google.protobuf.IBoolValue): google.protobuf.BoolValue;

            /**
             * Encodes the specified BoolValue message. Does not implicitly {@link google.protobuf.BoolValue.verify|verify} messages.
             * @param message BoolValue message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: google.protobuf.IBoolValue, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified BoolValue message, length delimited. Does not implicitly {@link google.protobuf.BoolValue.verify|verify} messages.
             * @param message BoolValue message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: google.protobuf.IBoolValue, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a BoolValue message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns BoolValue
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.protobuf.BoolValue;

            /**
             * Decodes a BoolValue message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns BoolValue
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.protobuf.BoolValue;

            /**
             * Verifies a BoolValue message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a BoolValue message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns BoolValue
             */
            public static fromObject(object: { [k: string]: any }): google.protobuf.BoolValue;

            /**
             * Creates a plain object from a BoolValue message. Also converts values to other types if specified.
             * @param message BoolValue
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: google.protobuf.BoolValue, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this BoolValue to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };
        }

        /** Properties of a StringValue. */
        interface IStringValue {

            /** StringValue value */
            value?: (string|null);
        }

        /** Represents a StringValue. */
        class StringValue implements IStringValue {

            /**
             * Constructs a new StringValue.
             * @param [properties] Properties to set
             */
            constructor(properties?: google.protobuf.IStringValue);

            /** StringValue value. */
            public value: string;

            /**
             * Creates a new StringValue instance using the specified properties.
             * @param [properties] Properties to set
             * @returns StringValue instance
             */
            public static create(properties?: google.protobuf.IStringValue): google.protobuf.StringValue;

            /**
             * Encodes the specified StringValue message. Does not implicitly {@link google.protobuf.StringValue.verify|verify} messages.
             * @param message StringValue message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: google.protobuf.IStringValue, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified StringValue message, length delimited. Does not implicitly {@link google.protobuf.StringValue.verify|verify} messages.
             * @param message StringValue message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: google.protobuf.IStringValue, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a StringValue message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns StringValue
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.protobuf.StringValue;

            /**
             * Decodes a StringValue message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns StringValue
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.protobuf.StringValue;

            /**
             * Verifies a StringValue message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a StringValue message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns StringValue
             */
            public static fromObject(object: { [k: string]: any }): google.protobuf.StringValue;

            /**
             * Creates a plain object from a StringValue message. Also converts values to other types if specified.
             * @param message StringValue
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: google.protobuf.StringValue, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this StringValue to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };
        }

        /** Properties of a BytesValue. */
        interface IBytesValue {

            /** BytesValue value */
            value?: (Uint8Array|null);
        }

        /** Represents a BytesValue. */
        class BytesValue implements IBytesValue {

            /**
             * Constructs a new BytesValue.
             * @param [properties] Properties to set
             */
            constructor(properties?: google.protobuf.IBytesValue);

            /** BytesValue value. */
            public value: Uint8Array;

            /**
             * Creates a new BytesValue instance using the specified properties.
             * @param [properties] Properties to set
             * @returns BytesValue instance
             */
            public static create(properties?: google.protobuf.IBytesValue): google.protobuf.BytesValue;

            /**
             * Encodes the specified BytesValue message. Does not implicitly {@link google.protobuf.BytesValue.verify|verify} messages.
             * @param message BytesValue message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: google.protobuf.IBytesValue, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified BytesValue message, length delimited. Does not implicitly {@link google.protobuf.BytesValue.verify|verify} messages.
             * @param message BytesValue message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: google.protobuf.IBytesValue, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a BytesValue message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns BytesValue
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.protobuf.BytesValue;

            /**
             * Decodes a BytesValue message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns BytesValue
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.protobuf.BytesValue;

            /**
             * Verifies a BytesValue message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a BytesValue message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns BytesValue
             */
            public static fromObject(object: { [k: string]: any }): google.protobuf.BytesValue;

            /**
             * Creates a plain object from a BytesValue message. Also converts values to other types if specified.
             * @param message BytesValue
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: google.protobuf.BytesValue, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this BytesValue to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };
        }

        /** Properties of a Duration. */
        interface IDuration {

            /** Duration seconds */
            seconds?: (number|Long|null);

            /** Duration nanos */
            nanos?: (number|null);
        }

        /** Represents a Duration. */
        class Duration implements IDuration {

            /**
             * Constructs a new Duration.
             * @param [properties] Properties to set
             */
            constructor(properties?: google.protobuf.IDuration);

            /** Duration seconds. */
            public seconds: (number|Long);

            /** Duration nanos. */
            public nanos: number;

            /**
             * Creates a new Duration instance using the specified properties.
             * @param [properties] Properties to set
             * @returns Duration instance
             */
            public static create(properties?: google.protobuf.IDuration): google.protobuf.Duration;

            /**
             * Encodes the specified Duration message. Does not implicitly {@link google.protobuf.Duration.verify|verify} messages.
             * @param message Duration message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: google.protobuf.IDuration, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified Duration message, length delimited. Does not implicitly {@link google.protobuf.Duration.verify|verify} messages.
             * @param message Duration message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: google.protobuf.IDuration, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a Duration message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns Duration
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.protobuf.Duration;

            /**
             * Decodes a Duration message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns Duration
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.protobuf.Duration;

            /**
             * Verifies a Duration message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a Duration message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns Duration
             */
            public static fromObject(object: { [k: string]: any }): google.protobuf.Duration;

            /**
             * Creates a plain object from a Duration message. Also converts values to other types if specified.
             * @param message Duration
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: google.protobuf.Duration, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this Duration to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };
        }

        /** Properties of an Empty. */
        interface IEmpty {
        }

        /** Represents an Empty. */
        class Empty implements IEmpty {

            /**
             * Constructs a new Empty.
             * @param [properties] Properties to set
             */
            constructor(properties?: google.protobuf.IEmpty);

            /**
             * Creates a new Empty instance using the specified properties.
             * @param [properties] Properties to set
             * @returns Empty instance
             */
            public static create(properties?: google.protobuf.IEmpty): google.protobuf.Empty;

            /**
             * Encodes the specified Empty message. Does not implicitly {@link google.protobuf.Empty.verify|verify} messages.
             * @param message Empty message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: google.protobuf.IEmpty, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified Empty message, length delimited. Does not implicitly {@link google.protobuf.Empty.verify|verify} messages.
             * @param message Empty message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: google.protobuf.IEmpty, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes an Empty message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns Empty
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.protobuf.Empty;

            /**
             * Decodes an Empty message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns Empty
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.protobuf.Empty;

            /**
             * Verifies an Empty message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates an Empty message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns Empty
             */
            public static fromObject(object: { [k: string]: any }): google.protobuf.Empty;

            /**
             * Creates a plain object from an Empty message. Also converts values to other types if specified.
             * @param message Empty
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: google.protobuf.Empty, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this Empty to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };
        }
    }
}
