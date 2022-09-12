export default abstract class BaseWallet {
	public abstract connect(): Promise<any>;
}
