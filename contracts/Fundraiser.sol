// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// Ownableコントラクトを継承するため
import "openzeppelin-solidity/contracts/access/Ownable.sol";
import "openzeppelin-solidity/contracts/utils/math/SafeMath.sol";

contract Fundraiser is Ownable {
  using SafeMath for uint256;
  uint256 public totalDonations; // 寄付の総額
  uint256 public donationsCount; // 寄付の件数

  // 構造体を利用して、新しい型を定義
  struct Donation {
    uint256 value; // 寄付されたイーサの額
    uint256 date;  // 寄付した日付
  }
  mapping(address => Donation[]) private _donations;

  string public name;                 // 受取人の名前
  string public url;                  // ユーザーが詳細を確認できるWebサイト
  string public imageURL;             // Topページのカードに使う画像のURL
  string public description;          // 受取人に関する簡単な説明
  // Solidityには、address型とaddress payable型の2種類のアドレスがある。
  // address payable型のアドレスでは、transferメソッドとsendメソッドを利用できることに加えて、イーサも受け取ることができる。
  // そのため、受取人のアドレスだけをaddress payable型で定義している。
  address payable public beneficiary; // 受取人のアドレス（資金を受け取ることができるアドレス）= Coinbaseなどのサービスで管理されているイーサリアムアドレス

  // 寄付者のアドレスと金額を受け取るイベント
  event DonationReceived(address indexed donor, uint256 value);
  event Withdraw(uint256 amount);

  constructor(
    string memory _name,
    string memory _url,
    string memory _imageURL,
    string memory _description,
    address payable _beneficiary,
    address _custodian 
  ) 
    public 
  {
    name = _name;                   // 受取人の名前
    url = _url;                     // ユーザーが詳細を確認できるWebサイト
    imageURL = _imageURL;           // Topページのカードに使う画像のURL
    description = _description;     // 受取人に関する簡単な説明
    beneficiary = _beneficiary;     // 受取人のアドレス（資金を受け取ることができるアドレス）= Coinbaseなどのサービスで管理されているイーサリアムアドレス
    // 管理人のみ受取人アドレスを更新することができるようにするため、-> 管理人が受取人アドレスの入力を間違えた場合や、受取人が利用している取引所を切り替えることにした場合などに必要な機能
    // Ownableコントラクトで定義されているtransferOwnership関数を使う。
    transferOwnership(_custodian);  // 管理人のアドレス
  }


  /**
    受取人アドレスの更新メソッド

    OwnableコントラクトのonlyOwner(関数修飾子)を使用して、関数を実行したアドレスが所有者であるかをチェックしている
   */
  function setBeneficiary(address payable _beneficiary) public onlyOwner {
    beneficiary = _beneficiary;
  }

  /**
    メッセージ送信者の寄付の件数を返却
 */
  function myDonationsCount() public view returns(uint256) {
    return _donations[msg.sender].length;
  }

  /**
    イーサを受け取る関数
  */
  function donate() public payable {
    // キーワード（ディクショナリ）構文を使って構造体を作成（初期化） -> キー:バリューで値をセットできるため、順序に大きく依存することがなくなる。
    Donation memory donation = Donation({
      value: msg.value,
      date: block.timestamp
    });
    _donations[msg.sender].push(donation);
    totalDonations = totalDonations.add(msg.value);
    donationsCount++;

    emit DonationReceived(msg.sender, msg.value);
  }

  /**
    寄付者が行った資金調達への寄付額と日付を返却
  */
  function myDonations() public view returns(
    uint256[] memory values,
    uint256[] memory dates
  )
  {
    uint256 count = myDonationsCount();
    values = new uint256[](count);
    dates = new uint256[](count);
    
    for (uint256 i = 0; i < count; i++) {
      Donation storage donation = _donations[msg.sender][i];
      values[i] = donation.value;
      dates[i] = donation.date;
    }

    return (values, dates);
  }

  /**
    コントラクトの残高を受取人に送金するテスト
   */
  function withdraw() public onlyOwner {
    uint256 balance = address(this).balance;
    beneficiary.transfer(balance);
    // Withdrawイベントをログに記録する
    emit Withdraw(balance);
  }

  /**
    フォールバック関数
   */
  fallback () external payable {
    totalDonations = totalDonations.add(msg.value);
    donationsCount++;
  }
}
